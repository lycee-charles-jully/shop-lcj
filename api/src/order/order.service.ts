import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { EmailService } from '../email/email.service';
import { basicProductFields } from '../product/entities/basic-product.entity';
import { Cart } from '../schemas/cart.schema';
import { OrderHistoryElement } from '../schemas/order-history-element.schema';
import { Order, OrderDoc } from '../schemas/order.schema';
import { ProductDoc } from '../schemas/product.schema';
import { RecommendationDoc } from '../schemas/recommendation.schema';
import { UserDoc } from '../schemas/user.schema';
import { OrderRecommendationDto } from './dto/order-recommendation.dto';
import { OrderStateEnum, pendingStates } from './enum/order-state.enum';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('order') private readonly OrderModel: Model<OrderDoc>,
        @InjectModel('recommendation') private readonly RecommendationModel: Model<RecommendationDoc>,
        private readonly EmailService: EmailService,
    ) {
    }

    getUserOrders(userID: string, mode: 'pending' | 'completed') {
        return this.OrderModel
            .find({
                user: userID,
                status: mode === 'pending'
                    ? { $in: pendingStates }
                    : OrderStateEnum.COMPLETED,
            })
            .exec();
    }

    async getOrderDetailsForMail(products: Cart[]) {
        const currencyFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
        const productsCount = new Map<string, number>(
            products.map(p => [ String(p.product), p.count ]),
        );
        const productsData = await this.ProductModel.find({
            _id: {
                $in: products.map(p => p.product),
            },
        })
            .select([ 'name', 'price', 'slug', 'coverImageUrl' ])
            .exec();
        const total = currencyFormat.format(
            productsData.reduce((tt, product) => tt + product.price * (productsCount.get(String(product._id)) || 1), 0),
        );

        return {
            total,
            products: productsData.map(p => ({
                name: p.name,
                image: p.coverImageUrl,
                quantity: `${productsCount.get(String(p._id)) || 1}x ${currencyFormat.format(p.price)} = ${currencyFormat.format(p.price * (productsCount.get(String(p._id)) || 1))}`,
                slug: p.slug,
            })),
        };
    }


    async populateOrderItems(order: { product: string | mongoose.Types.ObjectId, count: number }[]) {
        // Get the full details of the product the user has chosen
        const orderProducts = await this.ProductModel.find({
            _id: {
                $in: [
                    ...order.map(i => i.product),
                ],
            },
        }).exec();

        // Link the detailled products with the quantity they are requested with
        return orderProducts.map(product => {
            // Find the quantity requested inside the cart
            const { count } = order.find(p => String(p.product) === String(product._id))!;
            return { product, count };
        });
    }


    async createOrderFromCart(user: UserDoc, recommendations: OrderRecommendationDto[] = [], comment?: string) {

        if (user.cart.length < 1)
            throw new UnauthorizedException('Cannot create an order, your cart is empty');

        if (user.pendingOrders >= 5)
            throw new ForbiddenException('Cannot have more than 5 concurrent orders');

        if (recommendations.length > 0) {
            const recommendableProducts = await this.RecommendationModel
                .find()
                .select([ 'recommendedProduct' ])
                .exec()
                .then(docs => docs.map(doc => doc.recommendedProduct.toHexString()));
            recommendations = recommendations.filter(r => recommendableProducts.includes(r.product));
        }

        // Link the detailled products with the quantity they are requested with
        const orderProductsWithCount = await this.populateOrderItems([ ...user.cart, ...recommendations ]);

        // Verifies if the cart is valid
        orderProductsWithCount.forEach(({ product, count }) => {
            if (!product.available)
                throw new ForbiddenException(`${product.name} (${product.slug}) is not available`);

            if (product.stockCount === 0)
                throw new ForbiddenException(`${product.name} (${product.slug}) is out of stock`);

            if (typeof product.stockCount === 'number' && count > product.stockCount)
                throw new ForbiddenException(`${product.name} (${product.slug}) is not in sufficient stock (${count} requested, ${product.stockCount} available)`);
        });

        return Promise.all([
            this.UserModel.findByIdAndUpdate(user._id, {
                cart: [],
                $inc: {
                    pendingOrders: 1,
                    orderCount: 1,
                },
            }).exec(),
            new this.OrderModel({
                user: user._id,
                items: [
                    ...user.cart,
                    ...recommendations,
                ],
                comment,
            } as Omit<Order, 'createdAt' | 'modifiedAt' | 'status'>).save(),
            ...orderProductsWithCount.map(({ product, count }) => product.updateOne({
                $inc: {
                    orderCount: 1,
                    ...(typeof product.stockCount === 'number' ? { stockCount: -1 * count } : {}), // Decrease stock if present
                },
            })),
        ])
            .then(res => {
                this.getOrderDetailsForMail([ ...(user.cart as Cart[]), ...(recommendations as unknown as Cart[]) ])
                    .then(({ total, products }) => this.EmailService.sentOrderConfirmationEmail(
                        user.email,
                        {
                            name: user.firstname,
                            orderID: res[1]._id,
                            total,
                            products,
                        },
                    ));
                return res[1];
            })
            .catch(async (e) => {
                console.error(e);
                // Reverting changes on error
                // TODO: revert orderCount
                await this.UserModel.findByIdAndUpdate(user._id, {
                    cart: user.cart,
                });
                throw new InternalServerErrorException('Unable to create order');
            });
    }


    getOrder(orderID: string | mongoose.Types.ObjectId, sendPrivateData = false) {

        if (!mongoose.isValidObjectId(orderID))
            throw new BadRequestException('Invalid order ID');

        return this.OrderModel
            .findById(orderID)
            .select(!sendPrivateData && '-history.user')
            .populate(sendPrivateData && {
                path: 'user',
                model: this.UserModel,
                select: '-cart',
            } as PopulateOptions)
            .populate(sendPrivateData && {
                path: 'history.user',
                model: this.UserModel,
                select: [ 'firstname', 'lastname', 'email' ],
            } as PopulateOptions)
            .populate({
                path: 'items.product',
                model: this.ProductModel,
                select: basicProductFields,
            } as PopulateOptions)
            .exec()
            .then(doc => {
                if (!doc)
                    throw new NotFoundException(`Cannot find order ${orderID}`);
                return doc;
            });
    }


    async cancelOrder(userID: string | mongoose.Types.ObjectId, orderID: string, reason?: string) {
        const order = await this.OrderModel.findById(orderID);
        if (!order)
            throw new NotFoundException('Cannot find the order');
        if (order.user.toHexString() !== String(userID))
            throw new UnauthorizedException('You cannot cancel this order');
        if (![
            OrderStateEnum.WAITING_FOR_ACCEPTATION,
            OrderStateEnum.PREPARATING,
            OrderStateEnum.DELIVERING,
        ].includes(order.status))
            throw new UnauthorizedException('You cannot update a completed or already cancelled order');
        if (order.createdAt.getTime() + (86400 * 1000 * 2) < Date.now())
            throw new UnauthorizedException('You cannot cancel an order that is older than 2 days');

        const orderItems = await this.populateOrderItems(order.items);

        return Promise.all([
            this.OrderModel.findByIdAndUpdate(orderID, {
                status: OrderStateEnum.USER_CANCELLED,
                modifiedAt: new Date(),
                $push: {
                    history: {
                        user: userID as mongoose.Types.ObjectId,
                        newStatus: OrderStateEnum.USER_CANCELLED,
                        comment: reason,
                    } as Omit<OrderHistoryElement, 'createdAt'>,
                },
            }, {
                new: true,
                omitUndefined: true,
            })
                .select('-history.user')
                .populate({
                    path: 'user',
                    model: this.UserModel,
                    select: '-cart',
                } as PopulateOptions)
                .populate({
                    path: 'items.product',
                    model: this.ProductModel,
                    select: basicProductFields,
                } as PopulateOptions)
                .exec(),
            this.UserModel.findByIdAndUpdate(userID, {
                $inc: {
                    pendingOrders: -1,
                },
            }).exec(),
            ...orderItems.map(({ product, count }) => product.updateOne({
                $inc: {
                    orderCount: -1,
                    ...(typeof product.stockCount === 'number' ? { stockCount: count } : {}), // Increase stock if present
                },
            })),
        ])
            .then(res => res[0]);
    }

}
