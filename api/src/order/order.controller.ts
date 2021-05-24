import { Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
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
    makeOrder(@Req() { user }: RequestWithUserEntity) {
        // TODO: add recommendations
        return this.OrderService.createOrderFromCart(user);
    }

}
