import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { globalConvertOptions } from '../utils/global-convert-options';

export type ProductDoc = Product & mongoose.Document;


@Schema({
    toJSON: globalConvertOptions,
    toObject: globalConvertOptions,
})
export class Product {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, index: 'text' })
    name: string;

    @Prop({ required: true, index: 'text' })
    description: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'category' })
    category: mongoose.Types.ObjectId;

    @Prop({ default: () => nanoid(8) })
    slug: string;

    @Prop({ required: true })
    coverImageUrl: string;

    @Prop({ default: [] })
    imagesUrls: string[];

    @Prop({ required: true })
    price: number;

    @Prop({ default: [], index: 'text' })
    tags: string[];

    @Prop({ default: 0 })
    orderCount: number;

    @Prop({ default: 0 })
    viewCount: number;

    @Prop({ default: () => new Date() })
    createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
