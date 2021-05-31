import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { transformBoolean } from '../../utils/transformBoolean';
import { ProductOrderEnum } from '../enum/product-order.enum';

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

    @IsEnum(ProductOrderEnum)
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'The sorting order',
        enum: ProductOrderEnum,
        default: ProductOrderEnum.DATE,
    })
    sort: ProductOrderEnum = ProductOrderEnum.DATE;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'The slug of the category of the product',
    })
    category: string;

    @IsBoolean()
    @IsOptional()
    @Transform(transformBoolean)
    @ApiProperty({
        required: false,
        description: 'Include non available products',
        default: false,
    })
    nonAvailable: boolean = false;
}
