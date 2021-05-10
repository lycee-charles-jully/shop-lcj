import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUserEntity } from '../entities/request-with-user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        return !!(context.switchToHttp().getRequest() as RequestWithUserEntity).user;
    }
}
