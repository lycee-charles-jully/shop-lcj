import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { transformBoolean } from '../../utils/transformBoolean';

export class GetSingleProductParamsDto {
    @IsBoolean()
    @IsOptional()
    @Transform(transformBoolean)
    @ApiProperty({
        required: false,
        description: 'If the view count of the product should be increased',
        default: false,
    })
    stat?: boolean;
}
