import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AccountService } from '../../account/account.service';
import { UserDoc } from '../../schemas/user.schema';
import { DecodedJwtPayloadEntity } from '../entities/decoded-jwt-payload.entity';
import { RequestWithUserEntity, UserToken } from '../entities/request-with-user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly AccountService: AccountService) {
    }

    async use(req: RequestWithUserEntity, res: Response, next: NextFunction) {
        const token = req.cookies['token'];

        if (!token)
            return next();

        let payload: DecodedJwtPayloadEntity;
        let iat: Date;
        try {
            payload = jwt.verify(token, process.env.API_SECRET_JWT!, { ignoreExpiration: false }) as DecodedJwtPayloadEntity;
            iat = new Date(payload.iat * 1000);
        } catch {
            return next();
        }

        const user = await this.AccountService.findUserByID(payload.sub).then(d => d?.toObject()) as UserDoc | null;

        if (!user)
            return next();

        if (user.tokenCode !== payload.code)
            return next();

        req.user = {
            ...user,
            tokenCreatedAt: iat,
        } as UserToken;

        next();
    }
}
