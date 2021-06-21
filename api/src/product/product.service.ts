import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { AnnounceService } from '../announce/announce.service';
import { AnnouncePositionEnum } from '../announce/enum/announce-position.enum';
import { FileService } from '../file/file.service';
import { CategoryDoc } from '../schemas/category.schema';
import { ProductDoc } from '../schemas/product.schema';
import { UserDoc } from '../schemas/user.schema';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { basicProductFields } from './entities/basic-product.entity';


@Injectable()
export class ProductService {
    constructor(
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('category') private readonly CategoryModel: Model<CategoryDoc>,
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        private readonly FileService: FileService,
        private readonly AnnounceService: AnnounceService,
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
        const [ popular, latest, announces ] = await Promise.all([
            this.ProductModel.find({ available: true }).limit(5).sort('-viewCount').select(basicProductFields).exec(),
            this.ProductModel.find({ available: true }).limit(5).sort('-createdAt').select(basicProductFields).exec(),
            this.AnnounceService.getAnnouncesForUser(AnnouncePositionEnum.HOME),
        ]);
        return { popular, latest, announces };
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

    updateProduct(id: string, patch: UpdateProductDto) {
        return this.ProductModel
            .findByIdAndUpdate(
                id,
                patch,
                {
                    omitUndefined: true,
                    new: true,
                },
            )
            .exec()
            .then(doc => {
                if (!doc)
                    throw new NotFoundException('Cannot find product');
                return doc;
            });
    }

    async deleteProduct(id: string, name: string) {
        const product = await this.ProductModel.findById(id);

        if (!product)
            throw new NotFoundException(`Cannot find the product with ID ${id}`);
        if (product.name !== name)
            throw new UnauthorizedException('The provided name doesn\'t match the product\'s name');
        if (product.orderCount > 0)
            throw new UnauthorizedException('The product has already been ordered once, cannot delete it');


        await Promise.all([
            // Delete the product
            product.delete(),
            // Delete the images
            [ product.coverImageUrl, ...product.imagesUrls ].map(file => this.FileService.deleteFile(file)),
            // Delete the product reference in its category
            this.CategoryModel.updateOne(
                { products: id } as any,
                { $pull: { products: id } },
            ),
            // Delete the product in users' cart
            this.UserModel.updateMany(
                { 'cart.product': id },
                { $pull: { cart: { product: id } } },
            ),
        ]);

        return product;
    }
}
