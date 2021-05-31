import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions, FilterQuery } from 'mongoose';
import { FileService } from '../file/file.service';
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
        private readonly FileService: FileService,
    ) {
    }

    async getProducts(filters: GetProductsFilterDto) {
        let findOptions: FilterQuery<ProductDoc> = {};
        if (filters.category)
            findOptions = {
                category: await this.CategoryModel
                    .findOne({ slug: filters.category })
                    .exec()
                    .then(res => res?._id),
            };
        if (!filters.nonAvailable)
            findOptions = {
                ...findOptions,
                available: true,
            };

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
            this.ProductModel.find({ available: true }).limit(5).sort('-viewCount').select(basicProductFields).exec(),
            this.ProductModel.find({ available: true }).limit(5).sort('-createdAt').select(basicProductFields).exec(),
        ]);
        return { popular, latest };
    }

    async addProduct(product: AddProductDto, images: Express.Multer.File[]) {
        const category: CategoryDoc | null = await this.CategoryModel.findById(product.category);
        if (!category)
            throw new NotAcceptableException(`Category with ID ${product.category} doesn't exist`);
        const [ coverImageUrl, ...imagesUrls ] = await Promise.all(images.map(this.FileService.saveProductImage));
        const newProduct = await new this.ProductModel({
            ...product,
            coverImageUrl,
            imagesUrls,
        }).save();
        await category.updateOne({
            $push: {
                products: newProduct._id,
            },
        });
        return newProduct;
    }
}
