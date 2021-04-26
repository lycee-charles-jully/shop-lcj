import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddProductTypeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The product type\'s name',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The product type\'s name pluralized',
    })
    namePluralized: string;
}
