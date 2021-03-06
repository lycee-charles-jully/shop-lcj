import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OrderStateEnum } from '../order/enum/order-state.enum';
import { globalConvertOptions } from '../utils/global-convert-options';
import { Cart, CartSchema } from './cart.schema';
import { Schema as MongooseSchema } from 'mongoose';
import { OrderHistoryElement, OrderHistoryElementSchema } from './order-history-element.schema';

export type OrderDoc = Order & mongoose.Document;


@Schema({
    toJSON: globalConvertOptions,
    toObject: globalConvertOptions,
})
export class Order {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
    user: mongoose.Types.ObjectId;

    @Prop({ default: OrderStateEnum.WAITING_FOR_ACCEPTATION, type: OrderStateEnum })
    status: OrderStateEnum;

    @Prop({ default: () => new Date() })
    createdAt: Date;

    @Prop({ default: null, type: MongooseSchema.Types.Mixed })
    modifiedAt: Date | null;

    @Prop({ required: true, type: [ CartSchema ] })
    items: Cart[];

    @Prop()
    comment?: string;

    @Prop({ default: [], type: [ OrderHistoryElementSchema ] })
    history: OrderHistoryElement[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
