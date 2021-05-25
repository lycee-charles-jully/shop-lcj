import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, Max, Min } from 'class-validator';

export class OrderRecommendationDto {
    @IsMongoId()
    @ApiProperty({
        required: true,
        description: 'The ID of the product',
    })
    product: string;

    @IsNumber()
    @Min(1)
    @Max(10)
    @ApiProperty({
        description: 'The number of products',
        required: false,
        minimum: 1,
        maximum: 10,
        default: 1,
    })
    count: number = 1;
}
