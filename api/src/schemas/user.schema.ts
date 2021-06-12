import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { RoleEnum } from '../auth/enum/role.enum';
import { Cart, CartSchema } from './cart.schema';

export type UserDoc = User & mongoose.Document;

const convertOptions: mongoose.ToObjectOptions = {
    versionKey: false,
    transform(_, ret: User) {
        delete ret.password;
        if (ret.role > RoleEnum.UNVERIFIED_USER)
            delete ret.verification;
        else
            delete ret.verification?.code;
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

    @Prop({ default: RoleEnum.UNVERIFIED_USER, type: Number })
    role: RoleEnum;

    @Prop({ default: [], type: [ CartSchema ] })
    cart: Cart[];

    @Prop({ default: 0 })
    pendingOrders: number;

    @Prop({ default: 0 })
    orderCount: number;

    @Prop({ required: true })
    phone: string;

    @Prop({
        default: () => ({
            code: customAlphabet('0123456789', 6)(),
            attempts: 0,
            expires: new Date(Date.now() + 86_400_000), // Expires after 24h
        }),
        type: mongoose.Schema.Types.Mixed,
    })
    verification?: { code?: string, attempts: number, expires: Date };
}

export const UserSchema = SchemaFactory.createForClass(User);
