import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { RegisterDto } from './dto/register.dto';


@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private readonly AccountService: AccountService) {
    }

    @Post('register')
    register(@Body() user: RegisterDto) {
        return this.AccountService.createUser(user);
    }
}
