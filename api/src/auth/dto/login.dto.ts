import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { transformTrim } from '../../utils/transformTrim';

export class LoginDto {
    @IsEmail()
    @Transform(transformTrim)
    @ApiProperty({
        required: true,
        example: 'elon.musk@tesla.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        required: true,
        example: 'P@ssw0rd',
    })
    password: string;
}
