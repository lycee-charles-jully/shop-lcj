import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, Matches } from 'class-validator';

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
    @Matches(/[a-z0-9-]+/)
    @ApiProperty({
        required: true,
        description: 'The category\'s slug to display in the URL',
    })
    slug: string;

    @IsMongoId()
    @ApiProperty({
        required: true,
        description: 'The ID of the corresponding product type',
    })
    productType: string;
}
