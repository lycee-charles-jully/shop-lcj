import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProductTypeDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        required: false,
    })
    name: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        required: false,
    })
    namePluralized: string;
}
