import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { CategoryDoc } from '../schemas/category.schema';
import { ProductTypeDoc } from '../schemas/product-type.schema';
import { AddCategoryDto } from './dto/add-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel('category') private readonly CategoryModel: Model<CategoryDoc>,
        @InjectModel('product-type') private readonly ProductTypeModel: Model<ProductTypeDoc>,
    ) {
    }

    getCategories() {
        return this.CategoryModel
            .find()
            .populate({ path: 'productType', model: this.ProductTypeModel } as PopulateOptions)
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
