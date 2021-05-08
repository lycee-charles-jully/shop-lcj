import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from '../account/account.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [ AccountModule, PassportModule ],
    providers: [ AuthService, LocalStrategy ],
    controllers: [ AuthController ],
})
export class AuthModule {
}
