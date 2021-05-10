import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { RoleEnum } from '../auth/enum/role.enum';

export type UserDoc = User & mongoose.Document;

const convertOptions: mongoose.ToObjectOptions = {
    versionKey: false,
    transform(_, ret: User) {
        delete ret.password;
        return ret;
    },
};

@Schema({
    toJSON: convertOptions,
    toObject: convertOptions,
})
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true })
    password?: string;

    @Prop({ required: true })
    grade: string;

    @Prop({ required: true, unique: true })
    jeunestNumber: string;

    @Prop({ default: RoleEnum.USER, type: Number })
    role: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
