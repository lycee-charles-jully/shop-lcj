import { ApiProperty } from '@nestjs/swagger';
import { BasicAnnounceEntity } from '../../announce/entities/basic-announce.entity';
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

    @ApiProperty({
        type: [ BasicAnnounceEntity ],
    })
    announces: [ BasicAnnounceEntity ];
}
