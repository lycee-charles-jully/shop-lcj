import { Controller, Post, UseGuards, Request, HttpCode, Res, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest, Response } from 'express';
import { AccountService } from '../account/account.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUserEntity } from './entities/request-with-user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService, private readonly AccountService: AccountService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(200)
    @ApiBody({
        type: LoginDto,
    })
    async login(@Request() req: RequestWithUserEntity, @Res() res: Response) {
        const jwtData = this.AuthService.login(req.user);
        this.AuthService.applyAuthCookie(req, res, jwtData);
    }

    @Post('register')
    async register(@Body() user: RegisterDto, @Request() req: ExpressRequest, @Res() res: Response) {
        const createdUser = await this.AccountService.createUser(user);
        const jwtData = this.AuthService.login(createdUser);
        this.AuthService.applyAuthCookie(req, res, jwtData);
    }

}