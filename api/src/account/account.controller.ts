import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { UserDoc } from '../schemas/user.schema';

@ApiTags('Account')
@Controller('account')
export class AccountController {
    @Get('me')
    @Auth(RoleEnum.UNVERIFIED_USER)
    getUserData(@User() user: UserDoc) {
        return user;
    }
}
