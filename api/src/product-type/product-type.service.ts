import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductTypeDoc } from '../schemas/product-type.schema';
import { AddProductTypeDto } from './dto/add-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

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

    updateProductType(id: string, patch: UpdateProductTypeDto) {
        return this.ProductTypeModel
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
                    throw new NotFoundException('Cannot find the corresponding product type');
                return doc;
            });
    }
}
