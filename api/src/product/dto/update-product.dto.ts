import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Matches,
    Max,
    Min,
} from 'class-validator';
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

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    available?: boolean;

    @IsInt()
    @Min(0)
    @Max(500)
    @IsOptional()
    @ApiProperty({
        required: false,
        type: Number,
        nullable: true,
        minimum: 0,
        maximum: 500,
    })
    stockCount?: number | null;

    @IsString()
    @Matches(/^[0-9a-zA-Z_-]{20}\.png$/)
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    coverImageUrl?: string;

    @IsArray()
    @IsString({ each: true })
    @Matches(/^[0-9a-zA-Z_-]{20}\.png$/, { each: true })
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    imagesUrls?: string[];
}
