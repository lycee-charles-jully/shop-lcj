import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateProductDto {
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
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
