import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnounceModule } from '../announce/announce.module';
import { FileModule } from '../file/file.module';
import { CategorySchema } from '../schemas/category.schema';
import { ProductSchema } from '../schemas/product.schema';
import { UserSchema } from '../schemas/user.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'product', schema: ProductSchema },
            { name: 'category', schema: CategorySchema },
            { name: 'user', schema: UserSchema },
        ]),
        FileModule,
        AnnounceModule,
    ],
    controllers: [ ProductController ],
    providers: [ ProductService ],
})
export class ProductModule {
}
