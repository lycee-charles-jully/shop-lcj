import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { globalConvertOptions } from '../utils/global-convert-options';


export type RecommendationDoc = Recommendation & mongoose.Document;

@Schema({
    toJSON: globalConvertOptions,
    toObject: globalConvertOptions,
})
export class Recommendation {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'product' })
    recommendedProduct: mongoose.Types.ObjectId;

    @Prop({ default: [], type: [ mongoose.Schema.Types.ObjectId ], ref: 'product' })
    onProducts: mongoose.Types.ObjectId[];

    @Prop({ default: [], type: [ mongoose.Schema.Types.ObjectId ], ref: 'category' })
    onCategories: mongoose.Types.ObjectId[];

    @Prop({ default: [], type: [ mongoose.Schema.Types.ObjectId ], ref: 'productType' })
    onProductTypes: mongoose.Types.ObjectId[];
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
