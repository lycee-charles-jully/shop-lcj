import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { ProductDoc } from '../schemas/product.schema';
import { UserDoc } from '../schemas/user.schema';

@Injectable()
export class CartService {

    constructor(
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
    ) {
    }

    getCart(userID: string) {
        return this.UserModel
            .findById(userID)
            .populate({
                path: 'cart.product',
                model: this.ProductModel,
                select: [ '_id', 'name', 'price', 'slug', 'coverImageUrl' ],
            } as PopulateOptions)
            .exec()
            .then(user => user?.cart);
    }

    async addItemToCart(user: UserDoc, product: string, count = 1) {

        if (!await this.ProductModel.exists({ _id: product }))
            throw new NotFoundException('Product not found');

        if (user.cart.find(c => c.product.toHexString() === product))
            throw new ConflictException('Product already in cart');

        return this.UserModel.findOneAndUpdate({ _id: user._id }, {
            $push: {
                cart: {
                    product,
                    count,
                },
            },
        });
    }

}
