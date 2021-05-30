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
import { OrderStateEnum, pendingStates } from './enum/order-state.enum';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('order') private readonly OrderModel: Model<OrderDoc>,
        @InjectModel('recommendation') private readonly RecommendationModel: Model<RecommendationDoc>,
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
            } as Omit<Order, 'createdAt' | 'modifiedAt' | 'status'>).save(),
            this.ProductModel.updateMany(
                {
                    _id: {
                        $in: [
                            ...user.cart.map(i => i.product),
                            ...recommendations.map(i => i.product),
                        ],
                    },
                },
                {
                    $inc: { orderCount: 1 },
                },
            ).exec(),
        ])
            .then(res => res[1])
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

}
