import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { globalConvertOptions } from '../utils/global-convert-options';

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
}

export const CategorySchema = SchemaFactory.createForClass(Category);
