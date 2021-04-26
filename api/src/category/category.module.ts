import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../schemas/category.schema';
import { ProductTypeSchema } from '../schemas/product-type.schema';
import { ProductModel } from '../schemas/product.schema';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'category', schema: CategorySchema },
            { name: 'product-type', schema: ProductTypeSchema },
            { name: 'product', schema: ProductModel },
        ]),
    ],
    controllers: [ CategoryController ],
    providers: [ CategoryService ],
})
export class CategoryModule {
}
