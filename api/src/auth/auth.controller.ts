import { Body, Controller, Get, HttpCode, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest, Response } from 'express';
import { AccountService } from '../account/account.service';
import { UserDoc } from '../schemas/user.schema';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { RequestWithUserEntity } from './entities/request-with-user.entity';
import { RoleEnum } from './enum/role.enum';
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
        res.json(req.user);
    }

    @Get('refresh')
    @Auth(RoleEnum.USER)
    refreshToken(@Request() req: RequestWithUserEntity, @Res() res: Response) {
        const jwtData = this.AuthService.login(req.user);
        this.AuthService.applyAuthCookie(req, res, jwtData);
        res.json(req.user);
    }

    @Post('register')
    async register(@Body() user: RegisterDto, @Request() req: ExpressRequest, @Res() res: Response) {
        const createdUser = await this.AccountService.createUser(user);
        const jwtData = this.AuthService.login(createdUser);
        this.AuthService.applyAuthCookie(req, res, jwtData);
        res.json(createdUser);
    }

    @Post('verify')
    @Auth(RoleEnum.UNVERIFIED_USER)
    verify(@User() user: UserDoc, @Body() { code }: VerifyDto) {
        return this.AuthService.verifyUser(user, code);
    }

    @Get('logout')
    logout(@Request() req: ExpressRequest, @Res() res: Response) {
        this.AuthService.deleteAuthCookie(req, res);
        res.json(null);
    }

}
