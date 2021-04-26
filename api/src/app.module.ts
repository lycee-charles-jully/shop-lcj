import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true,
        }),
        ProductModule,
        CategoryModule,
        ProductTypeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
