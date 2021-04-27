import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions, FilterQuery } from 'mongoose';
import { CategoryDoc } from '../schemas/category.schema';
import { ProductDoc } from '../schemas/product.schema';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { basicProductFields } from './entities/basic-product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('category') private readonly CategoryModel: Model<CategoryDoc>,
    ) {
    }

    async getProducts(filters: GetProductsFilterDto) {
        let findOptions: FilterQuery<ProductDoc> = {};
        if (filters.category) {
            findOptions = {
                category: await this.CategoryModel
                    .findOne({ slug: filters.category })
                    .exec()
                    .then(res => res?._id),
            };
        }
        return this.ProductModel
            .find(findOptions)
            .limit(filters.limit)
            .skip(filters.offset)
            .sort(`-${filters.sort}`)
            .select(basicProductFields)
            .exec();
    }

    async getProduct(slug: string, stat = false) {
        const product = await this.ProductModel
            .findOne({ slug })
            .populate({
                path: 'category',
                model: this.CategoryModel,
                select: [ 'name', 'slug', 'productType' ],
            } as PopulateOptions)
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

    async addProduct(product: AddProductDto) {
        const categoryExists = await this.CategoryModel.exists({ _id: product.category });
        if (!categoryExists)
            throw new NotAcceptableException(`Category with ID ${product.category} doesn't exist`);
        return new this.ProductModel(product).save();
    }
}
