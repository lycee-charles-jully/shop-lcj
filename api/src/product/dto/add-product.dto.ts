import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
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

    @IsMongoId()
    @ApiProperty({
        required: true,
        description: 'The ID of the associated category',
    })
    category: string;
}
