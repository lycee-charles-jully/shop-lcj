import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { ProductDoc } from '../schemas/product.schema';
import { UserDoc } from '../schemas/user.schema';
import { UpdateProductDto } from './dto/update-product.dto';

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

    async removeItem(user: UserDoc, product: string) {

        if (!await this.ProductModel.exists({ _id: product }))
            throw new NotFoundException('Product not found');

        const res = await this.UserModel.updateOne(
            { _id: user._id },
            {
                $pull: {
                    cart: { product },
                },
            },
        );

        if (res.nModified < 1)
            throw new NotFoundException('This product is not in cart');

        return { product };

    }

    async updateItem(user: UserDoc, product: string, update: UpdateProductDto) {

        if (!await this.ProductModel.exists({ _id: product }))
            throw new NotFoundException('Product not found');

        return this.UserModel.findOneAndUpdate(
            { _id: user._id },
            { 'cart.$[item].count': update.count },
            {
                arrayFilters: [
                    { 'item.product': product },
                ],
                new: true,
                omitUndefined: true,
            },
        )
            .exec()
            .then(usr => usr?.cart?.find(i => i.product.toHexString() === product))
            .then(item => {
                if (!item)
                    throw new NotFoundException('Product is not in cart');
                return item;
            });

    }

}