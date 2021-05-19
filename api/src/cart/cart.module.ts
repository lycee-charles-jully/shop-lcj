import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../schemas/product.schema';
import { UserSchema } from '../schemas/user.schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'user', schema: UserSchema },
            { name: 'product', schema: ProductSchema },
        ]),
    ],
    controllers: [ CartController ],
    providers: [ CartService ],
})
export class CartModule {
}
