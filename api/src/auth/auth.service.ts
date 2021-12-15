import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { Request, Response } from 'express';
import { AccountService } from '../account/account.service';
import { UserDoc } from '../schemas/user.schema';
import { JwtDataEntity } from './entities/jwt-data.entity';
import { JwtPayloadEntity } from './entities/jwt-payload.entity';
import { RoleEnum } from './enum/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly AccountService: AccountService,
        private readonly JwtService: JwtService,
    ) {
    }

    checkEmailValidity(email: string) {
        const blacklist = [
            'monbureaunumerique.fr',
            'orange.fr',
            'ac-nancy-metz.fr',
        ];
        const emailDomain = email.split('@')[1];
        if (blacklist.includes(emailDomain))
            throw new NotAcceptableException(`The email domain ${emailDomain} is not allowed`);
        return true;
    }

    async validateUser(email: string, password: string) {
        const account = await this.AccountService.findUserByEmail(email);
        if (!account)
            return null;
        if (!bcrypt.compareSync(password, account.password!))
            return null;
        return account;
    }

    async verifyUser(user: UserDoc, code: string) {
        if (user.role > RoleEnum.UNVERIFIED_USER)
            throw new UnauthorizedException('Your account is already verified');
        const userDoc = (await this.AccountService.findUserByID(user._id))!;
        if (!userDoc.verification)
            throw new InternalServerErrorException('Error on the synchronization of the user role and verification');
        if (userDoc.verification.expires.getTime() < Date.now())
            throw new UnauthorizedException('This verification is expired, the account will be deleted');
        if (userDoc.verification.attempts >= 3)
            throw new UnauthorizedException('You exceeded the number of attempts, please wait until your account is deleted');
        if (userDoc.verification.code !== code) {
            await userDoc.updateOne(
                {
                    $inc: {
                        'verification.attempts': 1,
                    },
                },
            )!;
            throw new UnauthorizedException(`Invalid code. You have ${3 - (userDoc.verification.attempts + 1)} attempt(s) left`);
        }

        await userDoc.updateOne({
            $unset: {
                verification: '',
            },
            role: RoleEnum.USER,
        });

        delete userDoc.verification;
        userDoc.role = RoleEnum.USER;
        return userDoc;
    }

    login(user: UserDoc): JwtDataEntity {
        const payload: JwtPayloadEntity = { sub: user._id, code: user.tokenCode };
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

    deleteAuthCookie(req: Request, res: Response) {
        res.cookie('token', null, {
            maxAge: 0,
            httpOnly: true,
            domain: process.env.APP_DOMAIN,
            secure: req.secure,
            sameSite: 'strict',
        });
    }
}
