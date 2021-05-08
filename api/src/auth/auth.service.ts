import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { UserDoc } from '../schemas/user.schema';
import { JwtPayloadEntity } from './entities/jwt-payload.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly AccountService: AccountService,
        private readonly JwtService: JwtService,
    ) {
    }

    async validateUser(email: string, password: string) {
        const account = await this.AccountService.findUserByEmail(email);
        if (!account)
            return null;
        if (!bcrypt.compareSync(password, account.password!))
            return null;
        return account;
    }

    async login(user: UserDoc) {
        const payload: JwtPayloadEntity = { sub: user._id };
        return {
            token: this.JwtService.sign(payload),
            expires: dayjs().add(8, 'day').toDate(),
        };
    }
}
