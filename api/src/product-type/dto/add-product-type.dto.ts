import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';

export class AddProductTypeDto {
    @IsString()
    @IsNotEmpty()
    @Transform(transformTrim)
    @ApiProperty({
        required: true,
        description: 'The product type\'s name',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @Transform(transformTrim)
    @ApiProperty({
        required: true,
        description: 'The product type\'s name pluralized',
    })
    namePluralized: string;
}
