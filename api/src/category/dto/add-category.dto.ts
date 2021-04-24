import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The category\'s name',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The category\'s slug to display in the URL',
    })
    slug: string;
}
