import { ApiProperty } from '@nestjs/swagger';
import { BasicProductEntity } from './basic-product.entity';

export class HomeProductsEntity {
    @ApiProperty({
        type: () => [ BasicProductEntity ],
    })
    popular: HomeProductsEntity[];

    @ApiProperty({
        type: () => [ BasicProductEntity ],
    })
    latest: HomeProductsEntity;
}
