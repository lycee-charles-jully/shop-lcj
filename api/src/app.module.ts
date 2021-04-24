import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        ProductModule,
        CategoryModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
