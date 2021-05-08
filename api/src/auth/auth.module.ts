import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from '../account/account.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        AccountModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.API_SECRET_JWT,
            signOptions: {
                expiresIn: '8d',
            },
        }),
    ],
    providers: [ AuthService, LocalStrategy ],
    controllers: [ AuthController ],
})
export class AuthModule {
}
