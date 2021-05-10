import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enum/role.enum';

export const ROLES_KEY = 'roles';
export const Role = (role: RoleEnum) => SetMetadata(ROLES_KEY, role);
