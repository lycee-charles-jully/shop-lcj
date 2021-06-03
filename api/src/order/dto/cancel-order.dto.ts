import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';

export class CancelOrderDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Transform(transformTrim)
    @ApiProperty({
        required: false,
        description: 'The reason of the cancellation',
    })
    reason?: string;
}
