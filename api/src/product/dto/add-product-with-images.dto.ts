import { ApiProperty } from '@nestjs/swagger';
import { AddProductDto } from './add-product.dto';
import { Express } from 'express';

export class AddProductWithImagesDto extends AddProductDto {
    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'A list of the product images. The first one will be used as the cover image.',
    })
    images: Express.Multer.File[];
}
