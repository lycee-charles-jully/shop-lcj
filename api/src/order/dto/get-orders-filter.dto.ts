import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { transformCommaListToArray } from '../../utils/transformCommaListToArray';
import { OrderStateEnum } from '../enum/order-state.enum';

export class GetOrdersFilterDto {
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(50)
    @Type(() => Number)
    @ApiProperty({
        required: false,
        description: 'The maximum amount of orders to query',
        default: 20,
        minimum: 1,
        maximum: 50,
    })
    limit: number = 10;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({
        required: false,
        description: 'The offset',
        default: 0,
        minimum: 0,
    })
    offset: number = 0;

    @IsArray()
    @IsOptional()
    @IsEnum(OrderStateEnum, { each: true })
    @Transform(transformCommaListToArray)
    @ApiProperty({
        required: false,
        description: 'The states, comma separated. If empty, all the states will be selected',
        example: 'WAITING_FOR_ACCEPTATION,PREPARATING,DELIVERING',
        type: String,
    })
    states?: OrderStateEnum[];
}
