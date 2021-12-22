import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { OrderStateEnum } from '../enum/order-state.enum';

export class ProductOrderEntity {
    @ApiProperty({
        description: 'The order ID',
        example: '60bbe561064e56d8c95cbe7d',
    })
    _id: string;

    @ApiProperty({
        description: 'The order status',
        enum: OrderStateEnum,
    })
    status: OrderStateEnum;

    @ApiProperty({
        description: 'The ID, firstname and lastname of the user',
    })
    user: {
        _id: string | mongoose.Types.ObjectId,
        firstname: string,
        lastname: string,
    };

    @ApiProperty({
        description: 'The number of units of the product in the order',
    })
    count: number;

    @ApiProperty({
        description: 'The order creation date',
        example: '2021-12-24T23:59:59.999Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'The order last modification date',
        example: '2021-12-24T23:59:59.999Z',
    })
    modifiedAt: string;
}
