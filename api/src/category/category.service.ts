import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { CategoryDoc } from '../schemas/category.schema';
import { ProductTypeDoc } from '../schemas/product-type.schema';
import { ProductDoc } from '../schemas/product.schema';
import { AddCategoryDto } from './dto/add-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
                    sort: { viewCount: -1 },
                },
                match: {
                    available: true,
                },
                perDocumentLimit: 1,
            } as PopulateOptions)
            .populate({
                path: 'productType',
                model: this.ProductTypeModel,
            } as PopulateOptions)
            .exec();
    }

    getCategory(slug: string) {
        return this.CategoryModel
            .findOne({ slug })
            .select('-products')
            .populate({
                path: 'productType',
                model: this.ProductTypeModel,
            } as PopulateOptions)
            .exec()
            .then(doc => {
                if (!doc)
                    throw new NotFoundException('Cannot find the category');
                return doc;
            });
    }

    addCategory(category: AddCategoryDto) {
        return new this.CategoryModel(category)
            .save()
            .then(doc => doc.populate({
                path: 'productType',
                model: this.ProductTypeModel,
            } as PopulateOptions).execPopulate());
    }

    updateCategory(id: string, patch: UpdateCategoryDto) {
        return this.CategoryModel
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
                    throw new NotFoundException('Cannot find the category');
                return doc;
            })
            .then(doc => doc.populate({
                path: 'productType',
                model: this.ProductTypeModel,
            } as PopulateOptions).execPopulate());
    }
}
