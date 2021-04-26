import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { globalConvertOptions } from '../utils/global-convert-options';
import { ProductType } from './product-type.schema';

export type CategoryDoc = Category & mongoose.Document;

@Schema({
    toJSON: globalConvertOptions,
    toObject: globalConvertOptions,
})
export class Category {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'product-type' })
    productType: ProductType;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
