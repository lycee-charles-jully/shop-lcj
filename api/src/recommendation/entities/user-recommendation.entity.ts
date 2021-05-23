import { ApiProperty } from '@nestjs/swagger';
import { BasicProductEntity } from '../../product/entities/basic-product.entity';

export class UserRecommendationEntity {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    recommendedProduct: BasicProductEntity;
}
