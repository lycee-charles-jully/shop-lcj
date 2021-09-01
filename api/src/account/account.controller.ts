import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { UserDoc } from '../schemas/user.schema';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account-dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {

    constructor(private readonly AccountService: AccountService) {
    }

    @Get('me')
    @Auth(RoleEnum.UNVERIFIED_USER)
    getUserData(@User() user: UserDoc) {
        return user;
    }

    @Patch('me')
    @Auth(RoleEnum.USER)
    updateUserData(@User('_id') userID: string, @Body() update: UpdateAccountDto) {
        return this.AccountService.updateAccount(userID, update);
    }
}
