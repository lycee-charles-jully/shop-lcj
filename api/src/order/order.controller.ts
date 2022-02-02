import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotAcceptableException,
    Param,
    Patch,
    Post,
    Query,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { UserDoc } from '../schemas/user.schema';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { ChangeOrderStateDto } from './dto/change-order-state.dto';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';
import { OrderFromCartDto } from './dto/order-from-cart.dto';
import { OrderEntity } from './entities/order.entity';
import { ProductOrderEntity } from './entities/product-order.entity';
import { OrderAdminService } from './order-admin.service';
import { OrderService } from './order.service';


@ApiTags('Order')
@Controller('order')
export class OrderController {

    constructor(private readonly OrderService: OrderService, private readonly OrderAdminService: OrderAdminService) {
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

    @Get('/me/:order')
    @Auth(RoleEnum.USER)
    @ApiResponse({
        description: 'The detailled user\'s order',
        status: 200,
        type: OrderEntity,
    })
    async getUserOrder(@User('_id') userID: mongoose.Types.ObjectId, @Param('order') orderID: string) {
        const order = await this.OrderService.getOrder(orderID, false);
        if (order.user.toHexString() !== userID.toHexString())
            throw new UnauthorizedException('You are not allowed to view this order');
        return order;
    }

    @Post('from-cart')
    @Auth(RoleEnum.USER)
    @ApiResponse({
        description: 'The created order',
        status: 201,
        type: OrderEntity,
    })
    makeOrder(@User() user: UserDoc, @Body() { recommendations, comment }: OrderFromCartDto) {
        // !!!!! TEMPORARY ORDER DISABLE !!!!!
        throw new UnauthorizedException('Orders are currently not available');
        return this.OrderService.createOrderFromCart(user, recommendations, comment);
    }

    @Delete('/me/:order')
    @Auth(RoleEnum.USER)
    cancelOrder(@User('_id') userID: string, @Param('order') orderID: string, @Body() { reason }: CancelOrderDto) {
        if (!isValidObjectId(orderID))
            throw new NotAcceptableException(`Invalid order ID ${orderID}`);
        return this.OrderService.cancelOrder(userID, orderID, reason);
    }

    @Get()
    @Auth(RoleEnum.PREPARATOR)
    @ApiResponse({
        description: 'A list of the selected orders sorted by the createdAt field, with the basic product fields populated',
        status: 200,
        type: [ OrderEntity ],
    })
    getOrders(@Query() filters: GetOrdersFilterDto) {
        return this.OrderAdminService.getOrders(filters);
    }

    @Get(':order')
    @Auth(RoleEnum.PREPARATOR)
    @ApiResponse({
        description: 'The order details with populated data',
        status: 200,
        type: OrderEntity,
    })
    getOrderDetails(@Param('order') order: string) {
        return this.OrderService.getOrder(order, true);
    }

    @Patch(':order/state')
    @Auth(RoleEnum.PREPARATOR)
    changeOrderState(
        @Param('order') order: string,
        @Body() { state, comment }: ChangeOrderStateDto,
        @User('_id') user: string,
    ) {
        return this.OrderAdminService.updateOrderState(order, state, user, comment);
    }

    @Get('/product/:product')
    @Auth(RoleEnum.PREPARATOR)
    @ApiResponse({
        status: 200,
        description: 'A list of the last 20 orders for a certain product',
        type: [ ProductOrderEntity ],
    })
    getProductOrders(@Param('product') product: string) {
        if (!mongoose.isValidObjectId(product))
            throw new BadRequestException('The product ID is not valid');

        return this.OrderAdminService.getOrdersFromProduct(product);
    }

}
