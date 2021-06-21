import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteProductDto {
    @IsString()
    @ApiProperty({
        required: true,
        description: 'The name of the product to delete. Used as a confirmation',
    })
    name: string;
}
