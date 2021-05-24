import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions, Types } from 'mongoose';
import { basicProductFields } from '../product/entities/basic-product.entity';
import { Cart } from '../schemas/cart.schema';
import { CategoryDoc } from '../schemas/category.schema';
import { ProductTypeDoc } from '../schemas/product-type.schema';
import { ProductDoc } from '../schemas/product.schema';
import { RecommendationDoc } from '../schemas/recommendation.schema';
import { UserDoc } from '../schemas/user.schema';
import { getInvalidIDs } from '../utils/get-invalid-ids';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';


type ResolvedDep = { products: Types.ObjectId[], categories: Types.ObjectId[], productTypes: Types.ObjectId[] }


@Injectable()
export class RecommendationService {

    constructor(
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('category') private readonly CategoryModel: Model<CategoryDoc>,
        @InjectModel('product-type') private readonly ProductTypeModel: Model<ProductTypeDoc>,
        @InjectModel('recommendation') private readonly RecommendationModel: Model<RecommendationDoc>,
    ) {
    }

    async createRecommendation(recommendation: CreateRecommendationDto) {

        if (!await this.ProductModel.exists({ _id: recommendation.recommendedProduct }))
            throw new NotFoundException('The recommended product does not exist');

        if (!recommendation.onProducts.length && !recommendation.onCategories.length && !recommendation.onProductTypes.length)
            throw new BadRequestException('You must provide at least one condition');

        const [ invalidProducts, invalidCategories, invalidProductTypes ] = await Promise.all([
            getInvalidIDs(recommendation.onProducts, this.ProductModel),
            getInvalidIDs(recommendation.onCategories, this.CategoryModel),
            getInvalidIDs(recommendation.onProductTypes, this.ProductTypeModel),
        ]);

        let errorMessage = [];
        if (invalidProducts.length)
            errorMessage.push(invalidProducts.map(id => `${id} (product)`).join(', '));
        if (invalidCategories.length)
            errorMessage.push(invalidCategories.map(id => `${id} (category)`).join(', '));
        if (invalidProductTypes.length)
            errorMessage.push(invalidProductTypes.map(id => `${id} (product type)`).join(', '));

        if (errorMessage.length)
            throw new BadRequestException('The following IDs are not valid: ' + errorMessage.join(', '));

        return new this.RecommendationModel(recommendation).save();
    }

    async userRecommendations(user: UserDoc) {
        const cartDeps = await this.resolveCartProductDeps(user.cart);

        return this.RecommendationModel
            .find({
                $or: [
                    { onProducts: { $in: cartDeps.products } },
                    { onCategories: { $in: cartDeps.categories } },
                    { onProductTypes: { $in: cartDeps.productTypes } },
                ],
                recommendedProduct: {
                    $nin: user.cart.map(item => item.product),
                },
            })
            .select([ 'message', 'recommendedProduct' ])
            .populate({
                path: 'recommendedProduct',
                model: this.ProductModel,
                select: basicProductFields,
            } as PopulateOptions);
    }


    private resolveCartProductDeps(cart: Cart[]): Promise<ResolvedDep> {
        return this.ProductModel
            .find({
                _id: {
                    $in: cart.reduce(
                        (prev, prod) => [ ...prev, prod.product ],
                        [] as Types.ObjectId[],
                    ),
                },
            })
            .select([ '_id', 'category' ])
            .populate({
                path: 'category',
                model: this.CategoryModel,
                select: [ '_id', 'productType' ],
            } as PopulateOptions)
            .exec()
            .then(docs => docs.reduce(
                (prev, doc) => ({
                    products: [
                        ...prev.products,
                        doc._id,
                    ],
                    categories: [
                        ...prev.categories,
                        (doc.category as unknown as CategoryDoc)._id,
                    ],
                    productTypes: [
                        ...prev.productTypes,
                        (doc.category as unknown as CategoryDoc).productType as unknown as Types.ObjectId,
                    ],
                }),
                { products: [], categories: [], productTypes: [] } as ResolvedDep,
            ))
            .then(deps => ({
                products: [ ...new Set(deps.products.map(id => id.toHexString())) ]
                    .map(id => new Types.ObjectId(id)),
                categories: [ ...new Set(deps.categories.map(id => id.toHexString())) ]
                    .map(id => new Types.ObjectId(id)),
                productTypes: [ ...new Set(deps.productTypes.map(id => id.toHexString())) ]
                    .map(id => new Types.ObjectId(id)),
            }));
    }

}
