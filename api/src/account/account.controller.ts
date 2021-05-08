import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private readonly AccountService: AccountService) {
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() credentials: LoginDto) {
        return this.AccountService.login(credentials);
    }

    @Post('register')
    register(@Body() user: RegisterDto) {
        return this.AccountService.createUser(user);
    }
}
