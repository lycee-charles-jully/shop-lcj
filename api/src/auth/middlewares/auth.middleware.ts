import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AccountService } from '../../account/account.service';
import { UserDoc } from '../../schemas/user.schema';
import { JwtPayloadEntity } from '../entities/jwt-payload.entity';
import { RequestWithUserEntity, UserToken } from '../entities/request-with-user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly AccountService: AccountService) {
    }

    async use(req: RequestWithUserEntity, res: Response, next: NextFunction) {
        const token = req.cookies['token'];

        if (!token)
            return next();

        let decoded: JwtPayloadEntity;
        let iat: Date;
        try {
            decoded = jwt.verify(token, process.env.API_SECRET_JWT!, { ignoreExpiration: false }) as JwtPayloadEntity;
            iat = new Date((jwt.decode(token) as any).iat * 1000);
        } catch {
            return next();
        }

        req.user = {
            ...await this.AccountService.findUserByID(decoded.sub).then(d => d?.toObject()) as UserDoc,
            tokenCreatedAt: iat,
        } as UserToken;

        next();
    }
}
