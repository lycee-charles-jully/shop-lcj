import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDoc } from '../schemas/order.schema';
import { ProductDoc } from '../schemas/product.schema';
import { UserDoc } from '../schemas/user.schema';
import { OrderStateEnum } from './enum/order-state.enum';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('order') private readonly OrderModel: Model<OrderDoc>,
    ) {
    }

    getUserOrder(userID: string, mode: 'pending' | 'completed') {
        return this.OrderModel.find({
            user: userID,
            status: mode === 'pending'
                ? {
                    $in: [
                        OrderStateEnum.WAITING_FOR_ACCEPTATION,
                        OrderStateEnum.PREPARATING,
                        OrderStateEnum.DELIVERING,
                    ],
                }
                : OrderStateEnum.COMPLETED,
        });
    }

    createOrderFromCart(user: UserDoc) {

        if (user.cart.length < 1)
            throw new UnauthorizedException('Cannot create an order, your cart is empty');

        return Promise.all([
            this.UserModel.findByIdAndUpdate(user._id, {
                cart: [],
            }),
            new this.OrderModel({
                user: user._id,
                items: user.cart,
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
