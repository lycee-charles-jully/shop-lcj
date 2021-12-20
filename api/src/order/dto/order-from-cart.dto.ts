import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';
import { OrderRecommendationDto } from './order-recommendation.dto';

export class OrderFromCartDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderRecommendationDto)
    @ApiProperty({
        required: false,
        description: 'A list containing the chosen recommended products IDs and their count',
        default: [],
        type: [ OrderRecommendationDto ],
    })
    recommendations: OrderRecommendationDto[] = [];

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Transform(transformTrim)
    @ApiProperty({
        required: false,
        description: 'The optional comment the user made on his order',
    })
    comment?: string;
}
