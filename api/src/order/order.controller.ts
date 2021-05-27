import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { UserDoc } from '../schemas/user.schema';
import { ChangeOrderStateDto } from './dto/change-order-state.dto';
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
    getUserOrders(@User('_id') userID: string) {
        return this.OrderService.getUserOrders(userID, 'pending');
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

    @Get('all/pending')
    @Auth(RoleEnum.PREPARATOR)
    @ApiResponse({
        description: 'A list with the pending orders',
        status: 200,
        type: [ OrderEntity ],
    })
    getAllPendingOrders() {
        return this.OrderService.getAllOrders('pending');
    }

    @Get(':order')
    @Auth(RoleEnum.PREPARATOR)
    @ApiResponse({
        description: 'The order details with populated data',
        status: 200,
        type: OrderEntity,
    })
    getOrderDetails(@Param('order') order: string) {
        return this.OrderService.getOrder(order);
    }

    @Post(':order/state')
    @Auth(RoleEnum.PREPARATOR)
    changeOrderState(
        @Param('order') order: string,
        @Body() { state, comment }: ChangeOrderStateDto,
        @User('_id') user: string,
    ) {
        return this.OrderService.updateOrderState(order, state, user, comment);
    }

}
