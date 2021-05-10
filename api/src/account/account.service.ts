import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserDoc } from '../schemas/user.schema';
import { handleMongoError } from '../utils/handleMongoError';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class AccountService {
    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
    ) {
    }

    async createUser(user: RegisterDto) {
        user.password = bcrypt.hashSync(user.password, 10);
        let newUser;
        try {
            newUser = await new this.UserModel(user).save();
        } catch (e: unknown) {
            throw handleMongoError(e);
        }
        return newUser;
    }

    async findUserByEmail(email: string) {
        return this.UserModel.findOne({ email });
    }

    async findUserByID(id: string) {
        return this.UserModel.findById(id);
    }
}