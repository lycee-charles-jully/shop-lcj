import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { UserSchema } from '../schemas/user.schema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'user', schema: UserSchema },
        ]),
        EmailModule,
    ],
    providers: [ AccountService ],
    exports: [ AccountService ],
    controllers: [ AccountController ],
})
export class AccountModule {
}
