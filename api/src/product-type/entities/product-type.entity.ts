import { ApiProperty } from '@nestjs/swagger';

export class ProductTypeEntity {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    namePluralized: string;
}
