import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { OrderRecommendationDto } from './order-recommendation.dto';

export class OrderFromCartDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderRecommendationDto)
    @ApiProperty({
        required: false,
        description: 'A list containing the selected recommendation IDs',
        default: [],
    })
    recommendations: OrderRecommendationDto[] = [];
}
