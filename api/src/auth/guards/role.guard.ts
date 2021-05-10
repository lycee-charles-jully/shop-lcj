import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { RequestWithUserEntity } from '../entities/request-with-user.entity';
import { RoleEnum } from '../enum/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<RoleEnum>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRole)
            return true;

        const { user } = context.switchToHttp().getRequest() as RequestWithUserEntity;

        let userRole = RoleEnum.LOGGED_OUT;

        if (user)
            userRole = user.role;

        // If the user role value is greater or equal than the required value, the user is authorized
        return userRole >= requiredRole;
    }
}
