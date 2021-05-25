import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { OrderFromCartDto } from './dto/order-from-cart.dto';
import { OrderService } from './order.service';

// TODO: docs
@ApiTags('Order')
@Controller('order')
export class OrderController {

    constructor(private readonly OrderService: OrderService) {
    }

    @Get('me/pending')
    @Auth(RoleEnum.USER)
    getUserOrder(@Req() { user }: RequestWithUserEntity) {
        return this.OrderService.getUserOrder(user._id, 'pending');
    }

    @Post('from-cart')
    @Auth(RoleEnum.USER)
    makeOrder(@Req() { user }: RequestWithUserEntity, @Body() { recommendations }: OrderFromCartDto) {
        return this.OrderService.createOrderFromCart(user, recommendations);
    }

}
