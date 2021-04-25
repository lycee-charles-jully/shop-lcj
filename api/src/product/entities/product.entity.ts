import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    coverImageUrl: string;

    @ApiProperty()
    imagesUrls: string[];

    @ApiProperty()
    price: number;

    @ApiProperty()
    tags: string[];
}
