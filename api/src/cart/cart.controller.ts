import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/add-product.dto';

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

}
