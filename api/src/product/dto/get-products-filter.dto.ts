import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetProductsFilterDto {
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(20)
    @Type(() => Number)
    @ApiProperty({
        required: false,
        description: 'The maximum amount of products to query',
        default: 10,
        minimum: 1,
        maximum: 20,
    })
    limit: number = 10;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({
        required: false,
        description: 'The offset',
        default: 0,
        minimum: 0,
    })
    offset: number = 0;
}