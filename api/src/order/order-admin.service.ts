import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PopulateOptions } from 'mongoose';
import { EmailService } from '../email/email.service';
import { basicProductFields } from '../product/entities/basic-product.entity';
import { OrderHistoryElement } from '../schemas/order-history-element.schema';
import { OrderDoc } from '../schemas/order.schema';
import { ProductDoc } from '../schemas/product.schema';
import { RecommendationDoc } from '../schemas/recommendation.schema';
import { UserDoc } from '../schemas/user.schema';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';
import { OrderStateEnum } from './enum/order-state.enum';
import { OrderService } from './order.service';

@Injectable()
export class OrderAdminService {

    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('order') private readonly OrderModel: Model<OrderDoc>,
        @InjectModel('recommendation') private readonly RecommendationModel: Model<RecommendationDoc>,
        private readonly OrderService: OrderService,
        private readonly EmailService: EmailService,
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


    getOrders(filters: GetOrdersFilterDto) {
        return this.OrderModel
            .find(
                filters.states
                    ? {
                        status: {
                            $in: filters.states,
                        },
                    }
                    : {},
            )
            .limit(filters.limit)
            .skip(filters.offset)
            .populate({
                path: 'user',
                model: this.UserModel,
                select: [ 'firstname', 'lastname' ],
            } as PopulateOptions)
            .populate({
                path: 'items.product',
                model: this.ProductModel,
                select: basicProductFields,
            } as PopulateOptions)
            .sort('-createdAt')
            .select([ '-history' ])
            .exec();
    }


    async updateOrderState(orderID: string | mongoose.Types.ObjectId, state: OrderStateEnum, user: string | mongoose.Types.ObjectId, comment?: string) {
        const order = await this.OrderModel
            .findById(orderID)
            .select([ 'status', 'user', state === OrderStateEnum.ADMIN_CANCELLED && 'items' ])
            .exec();

        if (!order)
            throw new NotFoundException('Cannot find order');

        const { status: currentState, user: orderUser } = order;

        OrderAdminService.checkCanUpdateState(currentState, state);

        // If the order is cancelled, get the items to put them back in stock
        let orderItems;
        if (state === OrderStateEnum.ADMIN_CANCELLED)
            orderItems = await this.OrderService.populateOrderItems(order.items);

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
            // Put back the stock
            ...((state === OrderStateEnum.ADMIN_CANCELLED && orderItems)
                    ? orderItems.map(({ product, count }) => product.updateOne({
                        $inc: {
                            orderCount: -1,
                            ...(typeof product.stockCount === 'number' ? { stockCount: count } : {}), // Increase stock if present
                        },
                    }))
                    : []
            ),
        ])
            .then(res => {
                const order = res[0]!;
                const user = order.user as unknown as Omit<UserDoc, 'cart'>;
                if (order.status === OrderStateEnum.DELIVERING)
                    this.OrderService.getOrderDetailsForMail(order.items)
                        .then(({ total, products }) => this.EmailService.sentOrderReadyEmail(
                            user.email,
                            {
                                name: user.firstname,
                                total,
                                products,
                            },
                        ));
                return order;
            });
    }


    async getOrdersFromProduct(productID: string | mongoose.Types.ObjectId) {
        const orders = await this.OrderModel.find({
            items: {
                $elemMatch: {
                    product: productID,
                },
            },
        })
            .populate(
                'user',
                [ 'firstname', 'lastname' ],
                this.UserModel,
            )
            .sort('-createdAt')
            .select([ 'user', 'status', 'createdAt', 'modifiedAt', 'items' ])
            .limit(20);

        // Remove the whole cart and only returns the number of times the product is present in the cart
        return orders.map(order => ({
            ...order.toObject(),
            items: undefined,
            count: order.items.find(i => i.product.toString() == productID)?.count,
        }));
    }

}
