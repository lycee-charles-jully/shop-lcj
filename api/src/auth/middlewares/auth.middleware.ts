import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AccountService } from '../../account/account.service';
import { JwtPayloadEntity } from '../entities/jwt-payload.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly AccountService: AccountService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies['token'];

        if (!token)
            return next();

        let decoded: JwtPayloadEntity;
        try {
            decoded = jwt.verify(token, process.env.API_SECRET_JWT!, { ignoreExpiration: false }) as JwtPayloadEntity;
        } catch {
            return next();
        }

        req.user = await this.AccountService.findUserByID(decoded.sub) as any;

        next();
    }
}