import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { UserDoc } from '../schemas/user.schema';
import { OrderFromCartDto } from './dto/order-from-cart.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';


@ApiTags('Order')
@Controller('order')
export class OrderController {

    constructor(private readonly OrderService: OrderService) {
    }

    @Get('me/pending')
    @Auth(RoleEnum.USER)
    @ApiResponse({
        description: 'A list with the pending user orders',
        status: 200,
        type: [ OrderEntity ],
    })
    getUserOrder(@User('_id') userID: string) {
        return this.OrderService.getUserOrder(userID, 'pending');
    }

    @Post('from-cart')
    @Auth(RoleEnum.USER)
    @ApiResponse({
        description: 'The created order',
        status: 201,
        type: OrderEntity,
    })
    makeOrder(@User() user: UserDoc, @Body() { recommendations }: OrderFromCartDto) {
        return this.OrderService.createOrderFromCart(user, recommendations);
    }

}
