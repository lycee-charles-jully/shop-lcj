import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';
import { OrderStateEnum } from '../enum/order-state.enum';

export class ChangeOrderStateDto {
    @IsEnum(OrderStateEnum)
    @ApiProperty({
        description: 'The new state',
        required: true,
        enum: OrderStateEnum,
    })
    state: OrderStateEnum;

    @IsString()
    @IsOptional()
    @Transform(transformTrim)
    @ApiProperty({
        description: 'A small comment about the state change',
        required: false,
    })
    comment?: string;
}
