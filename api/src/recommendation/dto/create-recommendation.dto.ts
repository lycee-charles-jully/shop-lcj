import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';


export class CreateRecommendationDto {
    @IsString()
    @IsNotEmpty()
    @Transform(transformTrim)
    @ApiProperty({
        required: true,
        description: 'The name of the recommendation',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @Transform(transformTrim)
    @ApiProperty({
        required: true,
        description: 'The message shown when the product is recommended',
    })
    message: string;

    @IsMongoId()
    @ApiProperty({
        required: true,
        description: 'The recommended product ID',
    })
    recommendedProduct: string;

    @IsOptional()
    @IsArray()
    @ApiProperty({
        required: false,
        default: [],
        description: 'Products that triggers the recommendation',
    })
    onProducts: string[] = [];

    @IsOptional()
    @IsArray()
    @ApiProperty({
        required: false,
        default: [],
        description: 'Categories that triggers the recommendation',
    })
    onCategories: string[] = [];

    @IsOptional()
    @IsArray()
    @ApiProperty({
        required: false,
        default: [],
        description: 'Product types that triggers the recommendation',
    })
    onProductTypes: string[] = [];
}
