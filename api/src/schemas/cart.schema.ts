import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { globalConvertOptions } from '../utils/global-convert-options';

export type CartDoc = Cart & mongoose.Document;


@Schema({
    toJSON: globalConvertOptions,
    toObject: globalConvertOptions,
})
export class Cart {
    @Prop({ required: true, unique: true, type: mongoose.Schema.Types.ObjectId, ref: 'product' })
    product: mongoose.Types.ObjectId;

    @Prop({ default: 1 })
    count: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
