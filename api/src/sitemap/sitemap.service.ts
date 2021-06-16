import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDoc } from '../schemas/category.schema';
import { ProductDoc } from '../schemas/product.schema';

@Injectable()
export class SitemapService {
    constructor(
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('category') private readonly CategoryModel: Model<CategoryDoc>,
    ) {
    }

    async generateSitemap() {
        const [ products, categories ] = await Promise.all([
            this.getProducts(),
            this.getCategories(),
        ]);
        return (
            `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${products.join('')}
    ${categories.join('')}
</urlset>\
            `
        );
    }

    private async getProducts() {
        const products = await this.ProductModel
            .find({ available: true })
            .select([ 'slug' ])
            .exec();

        return products.map(({ slug }) => `
    <url>
        <loc>https://shop-lcj.fr/product/${slug}</loc>
        <priority>0.51</priority>
        <changefreq>daily</changefreq>
    </url>\
        `);
    }

    private async getCategories() {
        const categories = await this.CategoryModel
            .find({ $where: 'this.products.length > 0' })
            .select([ 'slug' ])
            .exec();

        return categories.map(({ slug }) => `
    <url>
        <loc>https://shop-lcj.fr/categories/${slug}</loc>
        <priority>0.51</priority>
        <changefreq>daily</changefreq>
    </url>\
        `);
    }
}
