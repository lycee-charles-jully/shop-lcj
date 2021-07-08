import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class AddImagesToProductDto {
    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'A list images to add at the end of the images URLs list.',
    })
    images: Express.Multer.File[];
}
