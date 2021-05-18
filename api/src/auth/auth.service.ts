import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { Request, Response } from 'express';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { UserDoc } from '../schemas/user.schema';
import { JwtDataEntity } from './entities/jwt-data.entity';
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

    login(user: UserDoc): JwtDataEntity {
        const payload: JwtPayloadEntity = { sub: user._id };
        return {
            token: this.JwtService.sign(payload),
            expires: dayjs().add(8, 'day').toDate(),
        };
    }

    applyAuthCookie(req: Request, res: Response, { token, expires }: JwtDataEntity) {
        res.cookie('token', token, {
            expires,
            httpOnly: true,
            domain: process.env.APP_DOMAIN,
            secure: req.secure,
            sameSite: 'strict',
        });
    }
}
