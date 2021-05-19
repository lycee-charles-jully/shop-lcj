import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';

@ApiTags('Account')
@Controller('account')
export class AccountController {
    @Get('me')
    @Auth(RoleEnum.USER)
    getUserData(@Request() { user }: RequestWithUserEntity) {
        return user;
    }
}
