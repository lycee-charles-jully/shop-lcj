import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { globalConvertOptions } from '../utils/global-convert-options';

export type ProductTypeDoc = ProductType & mongoose.Document;

@Schema({
    toJSON: globalConvertOptions,
    toObject: globalConvertOptions,
})
export class ProductType {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    namePluralized: string;
}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
