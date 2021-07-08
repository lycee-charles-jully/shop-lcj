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
import { ProductOrderEnum } from './enum/product-order.enum';


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
            .sort(filters.sort === ProductOrderEnum.NAME ? ProductOrderEnum.NAME : `-${filters.sort}`)
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

    async updateProduct(id: string, patch: UpdateProductDto) {

        const product = await this.ProductModel.findById(id).exec();
        if (!product)
            throw new NotFoundException('Cannot find product');

        if (patch.coverImageUrl || patch.imagesUrls) {
            const futureImages = await this.updateProductImages(
                product,
                { newCover: patch.coverImageUrl, newImages: patch.imagesUrls },
            );
            patch.coverImageUrl = futureImages[0];
            patch.imagesUrls = futureImages.slice(1);
        }

        return this.ProductModel
            .findByIdAndUpdate(
                id,
                patch,
                {
                    omitUndefined: true,
                    new: true,
                },
            )
            .exec();
    }

    private async updateProductImages(
        product: ProductDoc,
        { newCover, newImages }: { newCover?: string, newImages?: string[] },
    ) {

        // Verifying if the correcponding files exist in the storage
        if (newCover && this.FileService.resolveFilePath(newCover).code !== 200)
            throw new NotFoundException(`Cannot find the image ${newCover} for the cover image URL in the storage`);
        if (newImages && newImages.length >= 1)
            newImages.forEach(img => {
                if (this.FileService.resolveFilePath(img).code !== 200)
                    throw new NotFoundException(`Cannot find the image ${img} in the storage`);
            });

        const currentImages = [ product.coverImageUrl, ...product.imagesUrls ];
        const futureImages = [ (newCover || product.coverImageUrl), ...(newImages || product.imagesUrls) ];

        // Checks if all the images are associated to the product
        const outOfPlaceImage = futureImages.find(img => !currentImages.includes(img));
        if (outOfPlaceImage)
            throw new NotAcceptableException(`The image ${outOfPlaceImage} is not associated to this product`);

        // Check for duplicates images
        if (futureImages.length !== [ ...new Set(futureImages) ].length)
            throw new NotAcceptableException('Some images are duplicated');

        // Delete images that are not used anymore
        currentImages
            .filter(img => !futureImages.includes(img))
            .forEach(img => this.FileService.deleteFile(img));

        return futureImages;
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
