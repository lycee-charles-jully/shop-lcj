import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { basicProductFields } from '../product/entities/basic-product.entity';
import { Order, OrderDoc } from '../schemas/order.schema';
import { ProductDoc } from '../schemas/product.schema';
import { RecommendationDoc } from '../schemas/recommendation.schema';
import { UserDoc } from '../schemas/user.schema';
import { OrderRecommendationDto } from './dto/order-recommendation.dto';
import { OrderStateEnum } from './enum/order-state.enum';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('order') private readonly OrderModel: Model<OrderDoc>,
        @InjectModel('recommendation') private readonly RecommendationModel: Model<RecommendationDoc>,
    ) {
    }

    private readonly pendingState = [
        OrderStateEnum.WAITING_FOR_ACCEPTATION,
        OrderStateEnum.PREPARATING,
        OrderStateEnum.DELIVERING,
    ];

    getUserOrders(userID: string, mode: 'pending' | 'completed') {
        return this.OrderModel
            .find({
                user: userID,
                status: mode === 'pending'
                    ? { $in: this.pendingState }
                    : OrderStateEnum.COMPLETED,
            })
            .exec();
    }

    getAllOrders(mode: 'pending' | 'completed') {
        return this.OrderModel
            .find({
                status: mode === 'pending'
                    ? { $in: this.pendingState }
                    : OrderStateEnum.COMPLETED,
            })
            .populate({
                path: 'user',
                model: this.UserModel,
                select: [ 'firstname', 'lastname' ],
            } as PopulateOptions)
            .sort('-createdAt')
            .exec();
    }

    getOrder(orderID: string | mongoose.Types.ObjectId) {

        if (!mongoose.isValidObjectId(orderID))
            throw new BadRequestException('Invalid order ID');

        return this.OrderModel
            .findById(orderID)
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
            .exec()
            .then(doc => {
                if (!doc)
                    throw new NotFoundException(`Cannot find order ${orderID}`);
                return doc;
            });
    }

    async createOrderFromCart(user: UserDoc, recommendations: OrderRecommendationDto[] = []) {

        // TODO: limit the number of orders per user
        if (user.cart.length < 1)
            throw new UnauthorizedException('Cannot create an order, your cart is empty');

        if (recommendations.length > 0) {
            const recommendableProducts = await this.RecommendationModel
                .find()
                .select([ 'recommendedProduct' ])
                .exec()
                .then(docs => docs.map(doc => doc.recommendedProduct.toHexString()));
            recommendations = recommendations.filter(r => recommendableProducts.includes(r.product));
        }

        return Promise.all([
            this.UserModel.findByIdAndUpdate(user._id, {
                cart: [],
            }),
            new this.OrderModel({
                user: user._id,
                items: [
                    ...user.cart,
                    ...recommendations,
                ],
            } as Omit<Order, 'createdAt' | 'modifiedAt' | 'status'>).save(),
        ])
            .then(res => res[1])
            .catch(async (e) => {
                console.error(e);
                // Reverting changes on error
                await this.UserModel.findByIdAndUpdate(user._id, {
                    cart: user.cart,
                });
                throw new InternalServerErrorException('Unable to create order');
            });
    }

}
