import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class AddProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The product\'s name',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The product\'s description',
    })
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The product\'s cover image URL',
    })
    coverImageUrl: string;

    @IsArray()
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'Other images URLs of the product',
        default: [],
    })
    imagesUrls: string[] = [];

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty({
        required: true,
        description: 'The product\'s price',
    })
    price: number;

    @IsArray()
    @IsOptional()
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
