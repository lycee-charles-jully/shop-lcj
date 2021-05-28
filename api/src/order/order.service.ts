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
import { OrderHistoryElement } from '../schemas/order-history-element.schema';
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

    private static checkCanUpdateState(currentState: OrderStateEnum, newState: OrderStateEnum) {

        if (newState === OrderStateEnum.USER_CANCELLED)
            throw new UnauthorizedException('A preparator cannot mark an order as cancelled by the user');

        if (currentState === OrderStateEnum.USER_CANCELLED || currentState === OrderStateEnum.ADMIN_CANCELLED)
            throw new UnauthorizedException('The order is cancelled, cannot modify it');

        if (newState === OrderStateEnum.ADMIN_CANCELLED)
            return true;

        const stateValues: Map<OrderStateEnum, number> = new Map([
            [ OrderStateEnum.WAITING_FOR_ACCEPTATION, 0 ],
            [ OrderStateEnum.PREPARATING, 1 ],
            [ OrderStateEnum.DELIVERING, 2 ],
            [ OrderStateEnum.COMPLETED, 3 ],
        ]);

        if (stateValues.get(currentState)! >= stateValues.get(newState)!)
            throw new UnauthorizedException('Cannot modify the state to a previous step');

        return true;
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

    async updateOrderState(orderID: string | mongoose.Types.ObjectId, state: OrderStateEnum, user: string | mongoose.Types.ObjectId, comment?: string) {
        const currentState = await this.OrderModel
            .findById(orderID)
            .select('status')
            .exec()
            .then(doc => doc?.status);

        if (!currentState)
            throw new NotFoundException('Cannot find order');

        OrderService.checkCanUpdateState(currentState, state);

        return this.OrderModel
            .findByIdAndUpdate(orderID, {
                status: state,
                modifiedAt: new Date(),
                $push: {
                    history: {
                        user: user as mongoose.Types.ObjectId,
                        newStatus: state,
                        comment,
                    } as Omit<OrderHistoryElement, 'createdAt'>,
                },
            }, {
                new: true,
                omitUndefined: true,
            })
            .populate({
                path: 'user',
                model: this.UserModel,
                select: '-cart',
            } as PopulateOptions)
            .populate({
                path: 'history.user',
                model: this.UserModel,
                select: [ 'firstname', 'lastname', 'email' ],
            } as PopulateOptions)
            .populate({
                path: 'items.product',
                model: this.ProductModel,
                select: basicProductFields,
            } as PopulateOptions)
            .exec();
    }

}
