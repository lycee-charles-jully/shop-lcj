import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10)
    @ApiProperty({
        description: 'The number of product in the cart',
        minimum: 1,
        maximum: 10,
        required: false,
    })
    count?: number;
}
