import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(200)
    @ApiBody({
        type: LoginDto,
    })
    async login(@Request() req: any) {
        return req.user;
    }

}
