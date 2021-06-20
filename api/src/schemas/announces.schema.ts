import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AnnouncePositionEnum } from '../announce/enum/announce-position.enum';
import { globalConvertOptions } from '../utils/global-convert-options';

export type AnnounceDoc = Announce & mongoose.Document;

@Schema({
    toJSON: globalConvertOptions,
    toObject: globalConvertOptions,
})
export class Announce {
    @Prop({ required: true })
    message: string;

    @Prop({ enum: AnnouncePositionEnum, type: String })
    position: AnnouncePositionEnum;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    createdBy: mongoose.Types.ObjectId;

    @Prop({ default: () => new Date() })
    createdAt: Date;

    @Prop({ default: true })
    active: boolean;
}

export const AnnounceSchema = SchemaFactory.createForClass(Announce);
