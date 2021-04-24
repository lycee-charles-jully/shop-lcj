import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDoc } from '../schemas/product.schema';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel('product') private readonly ProductModel: Model<ProductDoc>) {
    }

    getProducts(filters: GetProductsFilterDto) {
        return this.ProductModel
            .find()
            .limit(filters.limit)
            .skip(filters.offset)
            .exec();
    }

    addProduct(product: AddProductDto) {
        return new this.ProductModel(product).save();
    }
}
