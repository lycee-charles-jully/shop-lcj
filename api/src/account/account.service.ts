import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service';
import { UserDoc } from '../schemas/user.schema';
import { handleMongoError } from '../utils/handleMongoError';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateAccountDto } from './dto/update-account-dto';

@Injectable()
export class AccountService {
    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        private readonly EmailService: EmailService,
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
        const verificationCode = newUser.verification?.code;
        this.EmailService.sendAccountConfirmationEmail(
            user.email,
            {
                code: verificationCode || 'Erreur',
                name: user.firstname,
            },
        );
        return newUser;
    }

    async updateAccount(userID: string, update: UpdateAccountDto) {
        return this.UserModel
            .findByIdAndUpdate(
                userID,
                update,
                { omitUndefined: true, new: true },
            );
    }

    async findUserByEmail(email: string) {
        return this.UserModel.findOne({ email });
    }

    async findUserByID(id: string) {
        return this.UserModel.findById(id);
    }
}
