import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../../category/entities/category.entity';
import { BasicProductEntity } from './basic-product.entity';

export class ProductEntity extends BasicProductEntity {
    @ApiProperty()
    description: string;

    @ApiProperty()
    imagesUrls: string[];

    @ApiProperty()
    category: CategoryEntity;

    @ApiProperty()
    stockCount: number;
}
