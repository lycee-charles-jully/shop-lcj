import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetSingleProductParamsDto {
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === '' || value === 'true' || value === '1')
    @ApiProperty({
        required: false,
        description: 'If the view count of the product should be increased',
        default: false,
    })
    stat?: boolean;
}
