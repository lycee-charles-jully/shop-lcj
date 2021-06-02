import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { transformCommaListToArray } from '../../utils/transformCommaListToArray';
import { transformTrim } from '../../utils/transformTrim';

export class AddProductDto {
    @IsString()
    @IsNotEmpty()
    @Transform(transformTrim)
    @ApiProperty({
        required: true,
        description: 'The product\'s name',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @Transform(transformTrim)
    @ApiProperty({
        required: true,
        description: 'The product\'s description',
    })
    description: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        description: 'The product\'s price',
    })
    price: number;

    @IsOptional()
    @Transform(transformTrim)
    @Transform(transformCommaListToArray)
    @ApiProperty({
        required: false,
        description: 'Product\'s tags',
        default: [],
    })
    tags: string[] = [];

    @IsMongoId()
    @ApiProperty({
        required: true,
        description: 'The ID of the associated category',
    })
    category: string;
}
