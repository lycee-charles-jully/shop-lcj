import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductTypeDoc } from '../schemas/product-type.schema';
import { AddProductTypeDto } from './dto/add-product-type.dto';

@Injectable()
export class ProductTypeService {
    constructor(@InjectModel('product-type') private readonly ProductTypeModel: Model<ProductTypeDoc>) {
    }

    getProductTypes() {
        return this.ProductTypeModel.find().exec();
    }

    addProductType(productType: AddProductTypeDto) {
        return new this.ProductTypeModel(productType).save();
    }
}
