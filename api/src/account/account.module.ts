import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'user', schema: UserSchema },
        ]),
    ],
    controllers: [ AccountController ],
    providers: [ AccountService ],
    exports: [ AccountService ],
})
export class AccountModule {
}
