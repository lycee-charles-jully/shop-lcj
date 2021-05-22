import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {

    constructor(private readonly CartService: CartService) {
    }

    @Get()
    @Auth(RoleEnum.USER)
    getCart(@Request() { user }: RequestWithUserEntity) {
        return this.CartService.getCart(user._id);
    }

    @Post()
    @Auth(RoleEnum.USER)
    addProductToCart(@Request() { user }: RequestWithUserEntity, @Body() { product, count }: AddProductDto) {
        return this.CartService.addItemToCart(user, product, count);
    }

    @Delete(':product')
    @Auth(RoleEnum.USER)
    removeProductFromCart(@Request() { user }: RequestWithUserEntity, @Param('product') product: string) {
        return this.CartService.removeItem(user, product);
    }

    @Patch(':product')
    @Auth(RoleEnum.USER)
    updateCartProduct(
        @Request() { user }: RequestWithUserEntity,
        @Param('product') product: string,
        @Body() update: UpdateProductDto,
    ) {
        return this.CartService.updateItem(user, product, update);
    }

}
