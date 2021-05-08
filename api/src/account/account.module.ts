import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';
import { AccountService } from './account.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'user', schema: UserSchema },
        ]),
    ],
    providers: [ AccountService ],
    exports: [ AccountService ],
})
export class AccountModule {
}
