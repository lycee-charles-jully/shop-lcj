import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OrderStateEnum } from '../order/enum/order-state.enum';
import { globalConvertOptions } from '../utils/global-convert-options';

export type OrderHistoryElementDoc = OrderHistoryElement & mongoose.Document;

@Schema({
    toObject: globalConvertOptions,
    toJSON: globalConvertOptions,
    _id: false,
})
export class OrderHistoryElement {
    @Prop({ default: () => new Date() })
    createdAt: Date;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
    user: mongoose.Types.ObjectId;

    @Prop({ required: true, enum: OrderStateEnum, type: OrderStateEnum })
    newStatus: OrderStateEnum;

    @Prop({ required: false, type: String })
    comment?: string;
}

export const OrderHistoryElementSchema = SchemaFactory.createForClass(OrderHistoryElement);
