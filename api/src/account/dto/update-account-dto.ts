import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength, IsOptional } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';

export class UpdateAccountDto {
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @Transform(transformTrim)
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'The new user\'s firstname',
    })
    firstname?: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @Transform(transformTrim)
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'The new user\'s lastname',
    })
    lastname?: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @Transform(transformTrim)
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'The new user\'s grade',
    })
    grade?: string;

    @IsString()
    @Matches(/^\d{5,6}$/)
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'The new user\'s Jeun\'est card number',
    })
    jeunestNumber?: string;

    @IsString()
    @Matches(/^0[67](\.\d{2}){4}$/)
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'The new mobile phone number',
    })
    phone?: string;
}
