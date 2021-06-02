import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';

export class UpdateProductDto {
    @IsNotEmpty()
    @IsOptional()
    @Transform(transformTrim)
    @ApiProperty({
        required: false,
    })
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Transform(transformTrim)
    @ApiProperty({
        required: false,
    })
    description?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    price?: number;

    @IsOptional()
    @IsArray()
    @ApiProperty({
        required: false,
        type: 'array',
        items: { type: 'string' },
    })
    tags?: string[];

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    available?: boolean;
}
