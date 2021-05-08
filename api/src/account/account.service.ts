import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc } from '../schemas/user.schema';
import { handleMongoError } from '../utils/handleMongoError';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
    ) {
    }

    private static InvalidCredentialsError = () => new UnauthorizedException('Invalid email or password');

    async createUser(user: RegisterDto) {
        user.password = bcrypt.hashSync(user.password, 10);
        let newUser;
        try {
            newUser = await new this.UserModel(user).save();
        } catch (e: unknown) {
            handleMongoError(e);
        }
        return newUser;
    }

    async login(credentials: LoginDto) {
        const user = await this.findUserByEmail(credentials.email);
        if (!user.password || !(await bcrypt.compare(credentials.password, user.password)))
            throw AccountService.InvalidCredentialsError();
        return {};
    }

    async findUserByEmail(email: string) {
        const user = await this.UserModel.findOne({ email });
        if (!user)
            throw AccountService.InvalidCredentialsError();
        return user!;
    }

    async findUserByID(id: string) {
        const user = await this.UserModel.findById(id);
        if (!user)
            throw AccountService.InvalidCredentialsError();
        return user!;
    }
}
