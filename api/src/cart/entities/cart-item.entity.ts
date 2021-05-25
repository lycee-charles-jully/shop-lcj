import { ApiProperty } from '@nestjs/swagger';

export class CartItemEntity {
    @ApiProperty({
        description: 'The product ID',
    })
    product: string;

    @ApiProperty({
        description: 'The product count',
        default: 1,
    })
    count: number;
}