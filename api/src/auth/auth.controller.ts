import { Controller, Post, UseGuards, Request, HttpCode, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestWithUserEntity } from './entities/request-with-user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(200)
    @ApiBody({
        type: LoginDto,
    })
    async login(@Request() req: RequestWithUserEntity, @Res() res: Response) {
        const { token, expires } = await this.AuthService.login(req.user);
        res.cookie('token', token, {
            expires,
            httpOnly: true,
            domain: process.env.APP_DOMAIN,
            secure: req.secure,
        });
        res.sendStatus(200);
    }

}
