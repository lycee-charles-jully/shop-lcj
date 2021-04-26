import { ApiProperty } from '@nestjs/swagger';
import { ProductTypeEntity } from '../../product-type/entities/product-type.entity';
import { BasicProductEntity } from '../../product/entities/basic-product.entity';

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


export class CategoryWithProductsEntity extends CategoryEntity {
    @ApiProperty()
    product: Pick<BasicProductEntity, '_id' | 'coverImageUrl'>[];
}
