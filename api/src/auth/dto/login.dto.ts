import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail()
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
