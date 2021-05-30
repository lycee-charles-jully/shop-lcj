import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
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

}
