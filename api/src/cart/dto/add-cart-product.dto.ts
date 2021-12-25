import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, Max, Min } from 'class-validator';

export class AddCartProductDto {
    @IsMongoId()
    @ApiProperty({
        description: 'The product ID',
        required: true,
    })
    product: string;

    @IsNumber()
    @Optional()
    @Min(1)
    @Max(10)
    @ApiProperty({
        description: 'The product count to add',
        required: false,
        default: 1,
        minimum: 1,
        maximum: 10,
    })
    count: number = 1;
}
