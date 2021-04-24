import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDoc } from '../schemas/category.schema';
import { AddCategoryDto } from './dto/add-category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel('category') private readonly CategoryModel: Model<CategoryDoc>) {
    }

    getCategories() {
        return this.CategoryModel.find().exec();
    }

    addCategory(category: AddCategoryDto) {
        return new this.CategoryModel(category).save();
    }
}
