import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../file/file.module';
import { CategorySchema } from '../schemas/category.schema';
import { ProductSchema } from '../schemas/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'product', schema: ProductSchema },
            { name: 'category', schema: CategorySchema },
        ]),
        FileModule,
    ],
    controllers: [ ProductController ],
    providers: [ ProductService ],
})
export class ProductModule {
}
