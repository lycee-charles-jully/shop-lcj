import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';

export class UpdateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Transform(transformTrim)
    @ApiProperty({
        required: false,
    })
    name?: string;

    @IsString()
    @Matches(/^[a-z0-9-]+$/)
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    slug?: string;
}
