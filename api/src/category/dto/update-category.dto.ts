import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
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
