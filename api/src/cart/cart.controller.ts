import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { UserDoc } from '../schemas/user.schema';
import { CartService } from './cart.service';
import { AddCartProductDto } from './dto/add-cart-product.dto';
import { UpdateCartProductDto } from './dto/update-cart-product.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {

    constructor(private readonly CartService: CartService) {
    }

    @Get()
    @Auth(RoleEnum.USER)
    getCart(@User('_id') userID: string) {
        return this.CartService.getCart(userID);
    }

    @Post()
    @Auth(RoleEnum.USER)
    addProductToCart(@User() user: UserDoc, @Body() { product, count }: AddCartProductDto) {
        return this.CartService.addItemToCart(user, product, count);
    }

    @Delete(':product')
    @Auth(RoleEnum.USER)
    removeProductFromCart(@User() user: UserDoc, @Param('product') product: string) {
        return this.CartService.removeItem(user, product);
    }

    @Patch(':product')
    @Auth(RoleEnum.USER)
    updateCartProduct(
        @User() user: UserDoc,
        @Param('product') product: string,
        @Body() update: UpdateCartProductDto,
    ) {
        return this.CartService.updateItem(user, product, update);
    }

}
