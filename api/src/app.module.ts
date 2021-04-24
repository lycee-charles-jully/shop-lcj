import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
