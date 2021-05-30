import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { basicProductFields } from '../product/entities/basic-product.entity';
import { OrderHistoryElement } from '../schemas/order-history-element.schema';
import { OrderDoc } from '../schemas/order.schema';
import { ProductDoc } from '../schemas/product.schema';
import { RecommendationDoc } from '../schemas/recommendation.schema';
import { UserDoc } from '../schemas/user.schema';
import { OrderStateEnum, pendingStates } from './enum/order-state.enum';

@Injectable()
export class OrderAdminService {

    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('order') private readonly OrderModel: Model<OrderDoc>,
        @InjectModel('recommendation') private readonly RecommendationModel: Model<RecommendationDoc>,
    ) {
    }

    static checkCanUpdateState(currentState: OrderStateEnum, newState: OrderStateEnum) {

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


    getAllOrders(mode: 'pending' | 'completed') {
        return this.OrderModel
            .find({
                status: mode === 'pending'
                    ? { $in: pendingStates }
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


    async updateOrderState(orderID: string | mongoose.Types.ObjectId, state: OrderStateEnum, user: string | mongoose.Types.ObjectId, comment?: string) {
        const order = await this.OrderModel
            .findById(orderID)
            .select([ 'status', 'user' ])
            .exec();

        if (!order)
            throw new NotFoundException('Cannot find order');

        const { status: currentState, user: orderUser } = order;

        OrderAdminService.checkCanUpdateState(currentState, state);

        return Promise.all([
            this.OrderModel
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
                .exec(),
            (state === OrderStateEnum.COMPLETED || state === OrderStateEnum.ADMIN_CANCELLED || state === OrderStateEnum.USER_CANCELLED)
                ? this.UserModel.findByIdAndUpdate(orderUser, {
                    $inc: {
                        pendingOrders: -1,
                    },
                })
                : null,
        ])
            .then(res => res[0]);
    }

}
