import { Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CategoryDoc = Category & mongoose.Document;

export class Category {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
