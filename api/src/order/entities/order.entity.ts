import { ApiProperty } from '@nestjs/swagger';
import { CartItemEntity } from '../../cart/entities/cart-item.entity';
import { OrderStateEnum } from '../enum/order-state.enum';

export class OrderEntity {
    @ApiProperty({
        description: 'The order\'s ID',
    })
    _id: string;

    @ApiProperty({
        description: 'The ID of the user that issued the order',
    })
    user: string;

    @ApiProperty({
        description: 'The current status of the order',
        enum: OrderStateEnum,
        example: OrderStateEnum.WAITING_FOR_ACCEPTATION,
    })
    status: OrderStateEnum;

    @ApiProperty({
        description: 'The list of the products in the order',
        type: [ CartItemEntity ],
    })
    items: CartItemEntity[];

    @ApiProperty({
        description: 'The order\'s creation date',
        example: '2021-01-01T12:00:00.000Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'The order\'s last update date',
        required: false,
        example: null,
    })
    modifiedAt: string;
}
