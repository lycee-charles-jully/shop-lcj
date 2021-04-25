import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDoc } from '../schemas/product.schema';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

const BASIC_PRODUCT_FIELD = [ '_id', 'name', 'slug', 'coverImageUrl', 'price' ];

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
            .select(BASIC_PRODUCT_FIELD)
            .exec();
    }

    async getHomeProducts() {
        const [ popular, latest ] = await Promise.all([
            this.ProductModel.find().limit(5).sort('-viewCount').select(BASIC_PRODUCT_FIELD).exec(),
            this.ProductModel.find().limit(5).sort('-createdAt').select(BASIC_PRODUCT_FIELD).exec(),
        ]);
        return { popular, latest };
    }

    addProduct(product: AddProductDto) {
        return new this.ProductModel(product).save();
    }
}
