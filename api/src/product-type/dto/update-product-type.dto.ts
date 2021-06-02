import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';

export class UpdateProductTypeDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Transform(transformTrim)
    @ApiProperty({
        required: false,
    })
    name?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Transform(transformTrim)
    @ApiProperty({
        required: false,
    })
    namePluralized?: string;
}
