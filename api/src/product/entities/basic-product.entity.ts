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

    @ApiProperty()
    available: boolean;

    @ApiProperty({
        type: Number,
        nullable: true,
    })
    stockCount: number | null;
}

export const basicProductFields = [ '_id', 'name', 'slug', 'coverImageUrl', 'price', 'available', 'stockCount' ];
