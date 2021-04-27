import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../schemas/category.schema';
import { ProductModel } from '../schemas/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'product', schema: ProductModel },
            { name: 'category', schema: CategorySchema },
        ]),
    ],
    controllers: [ ProductController ],
    providers: [ ProductService ],
})
export class ProductModule {
}
