import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions, FilterQuery } from 'mongoose';
import { nanoid } from 'nanoid';
import { CategoryDoc } from '../schemas/category.schema';
import { ProductDoc } from '../schemas/product.schema';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { basicProductFields } from './entities/basic-product.entity';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

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

    async addProduct(product: AddProductDto, images: Express.Multer.File[]) {
        const category: CategoryDoc | null = await this.CategoryModel.findById(product.category);
        if (!category)
            throw new NotAcceptableException(`Category with ID ${product.category} doesn't exist`);
        const [ coverImageUrl, ...imagesUrls ] = await Promise.all(images.map(ProductService.processImage));
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

    private static async processImage(image: Express.Multer.File) {
        const imageID = nanoid(20);
        const storagePath = path.resolve('./storage/');
        const imagePath = path.resolve(storagePath, `${imageID}.png`);
        fs.mkdirSync(storagePath, { recursive: true });
        await sharp(image.buffer)
            .rotate()
            .resize({
                width: 2000,
                height: 2000,
                fit: 'contain',
                withoutEnlargement: true,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .toFile(imagePath);
        return `${imageID}.png`;
    }
}
