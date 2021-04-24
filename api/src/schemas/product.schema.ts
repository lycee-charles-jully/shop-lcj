import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { nanoid } from 'nanoid';

export type ProductDoc = Product & mongoose.Document;

const convertOptions: mongoose.ToObjectOptions = {
    versionKey: false,
};

@Schema({
    toJSON: convertOptions,
    toObject: convertOptions,
})
export class Product {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, index: 'text' })
    name: string;

    @Prop({ required: true, index: 'text' })
    description: string;

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
}

export const ProductModel = SchemaFactory.createForClass(Product);
