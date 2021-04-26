import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDoc } from '../schemas/product.schema';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { basicProductFields } from './entities/basic-product.entity';

@Injectable()
export class ProductService {
    constructor(@InjectModel('product') private readonly ProductModel: Model<ProductDoc>) {
    }

    getProducts(filters: GetProductsFilterDto) {
        return this.ProductModel
            .find()
            .limit(filters.limit)
            .skip(filters.offset)
            .sort(`-${filters.sort}`)
            .select(basicProductFields)
            .exec();
    }

    async getProduct(slug: string, stat = false) {
        const product = await this.ProductModel
            .findOne({ slug })
            .exec();
        if (!product)
            throw new NotFoundException('Product not found');
        if (stat)
            product.updateOne({ $inc: { viewCount: 1 } }).exec();
        return product;
    }

    async getHomeProducts() {
        const [ popular, latest ] = await Promise.all([
            this.ProductModel.find().limit(5).sort('-viewCount').select(basicProductFields).exec(),
            this.ProductModel.find().limit(5).sort('-createdAt').select(basicProductFields).exec(),
        ]);
        return { popular, latest };
    }

    addProduct(product: AddProductDto) {
        return new this.ProductModel(product).save();
    }
}
