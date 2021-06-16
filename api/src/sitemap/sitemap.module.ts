import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../schemas/category.schema';
import { ProductSchema } from '../schemas/product.schema';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'product', schema: ProductSchema },
            { name: 'category', schema: CategorySchema },
        ]),
    ],
    controllers: [ SitemapController ],
    providers: [ SitemapService ],
})
export class SitemapModule {
}
