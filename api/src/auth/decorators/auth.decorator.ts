import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { RoleEnum } from '../enum/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Role } from './role.decorator';

export function Auth(role: RoleEnum) {
    return applyDecorators(
        UseGuards(JwtAuthGuard, RoleGuard),
        Role(role),
        ApiCookieAuth(),
    );
}
