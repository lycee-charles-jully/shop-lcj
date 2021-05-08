import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AccountService } from '../../account/account.service';
import { JwtPayloadEntity } from '../entities/jwt-payload.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly AccountService: AccountService) {
        super({
            jwtFromRequest: (req: Request) => req.cookies?.token,
            ignoreExpiration: false,
            secretOrKey: process.env.API_SECRET_JWT,
        });
    }

    async validate(payload: JwtPayloadEntity) {
        return this.AccountService.findUserByID(payload.sub);
    }
}