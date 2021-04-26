import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { CategoryDoc } from '../schemas/category.schema';
import { ProductTypeDoc } from '../schemas/product-type.schema';
import { ProductDoc } from '../schemas/product.schema';
import { AddCategoryDto } from './dto/add-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel('category') private readonly CategoryModel: Model<CategoryDoc>,
        @InjectModel('product-type') private readonly ProductTypeModel: Model<ProductTypeDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
    ) {
    }

    getCategories() {
        return this.CategoryModel
            .find()
            .populate({
                path: 'products',
                model: this.ProductModel,
                select: [ 'coverImageUrl' ],
                options: {
                    // TODO: lower the limit to 1. Idk why but there is a freaking bug
                    // TODO: where there is plenty of products but an empty array is returned,
                    // TODO: like if the selected product was skipped
                    limit: 2,
                    sort: { viewCount: -1 },
                },
            } as PopulateOptions)
            .populate({
                path: 'productType',
                model: this.ProductTypeModel,
            } as PopulateOptions)
            .exec();
    }

    addCategory(category: AddCategoryDto) {
        return new this.CategoryModel(category)
            .save()
            .then(doc => doc.populate({
                path: 'productType',
                model: this.ProductTypeModel,
            } as PopulateOptions).execPopulate());
    }
}
