import { ApiProperty } from '@nestjs/swagger';

export class RecommendationEntity {
    @ApiProperty()
    name: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    recommendedProduct: string;

    @ApiProperty()
    onProducts: string[];

    @ApiProperty()
    onCategories: string[];

    @ApiProperty()
    onProductTypes: string[];
}