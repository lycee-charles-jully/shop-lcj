import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnounceSchema } from '../schemas/announces.schema';
import { UserSchema } from '../schemas/user.schema';
import { AnnounceController } from './announce.controller';
import { AnnounceService } from './announce.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'announce', schema: AnnounceSchema },
            { name: 'user', schema: UserSchema },
        ]),
    ],
    controllers: [ AnnounceController ],
    providers: [ AnnounceService ],
    exports: [ AnnounceService ],
})
export class AnnounceModule {
}
