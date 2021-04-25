import { ApiProperty } from '@nestjs/swagger';

export class BasicProductEntity {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    coverImageUrl: string;

    @ApiProperty()
    price: number;
}

export const basicProductFields = [ '_id', 'name', 'slug', 'coverImageUrl', 'price' ];