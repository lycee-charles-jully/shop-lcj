import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { UserDoc } from '../schemas/user.schema';
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
    getUserOrder(@User('_id') userID: string) {
        return this.OrderService.getUserOrder(userID, 'pending');
    }

    @Post('from-cart')
    @Auth(RoleEnum.USER)
    makeOrder(@User() user: UserDoc, @Body() { recommendations }: OrderFromCartDto) {
        return this.OrderService.createOrderFromCart(user, recommendations);
    }

}
