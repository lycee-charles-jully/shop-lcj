import { ApiProperty } from '@nestjs/swagger';
import { ProductTypeEntity } from '../../product-type/entities/product-type.entity';

export class CategoryEntity {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    productType: ProductTypeEntity;
}