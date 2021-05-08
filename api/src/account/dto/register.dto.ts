import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IsStrongPassword } from '../../validators/IsStrongPassword';

export class RegisterDto {
    @IsEmail()
    @ApiProperty({
        required: true,
        description: 'The user\'s email',
        example: 'elon.musk@tesla.com',
    })
    email: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @ApiProperty({
        required: true,
        description: 'The user\'s firstname',
        example: 'Elon',
    })
    firstname: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @ApiProperty({
        required: true,
        description: 'The user\'s lastname',
        example: 'Musk',
    })
    lastname: string;

    @IsString()
    @IsStrongPassword()
    @ApiProperty({
        required: true,
        description: 'The user\'s password. It must be minimum eight characters, have at least one letter and one number',
        example: 'p@ssw0rd',
    })
    password: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @ApiProperty({
        required: true,
        description: 'The user\'s grade',
        example: 'TG1',
    })
    grade: string;

    @IsString()
    @Matches(/^\d{5}$/)
    @ApiProperty({
        required: true,
        description: 'The user\'s Jeun\'est card number',
        example: '12345',
    })
    jeunestNumber: string;
}