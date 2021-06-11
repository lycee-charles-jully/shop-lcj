import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class VerifyDto {
    @IsString()
    @Matches(/^\d{6}$/)
    @ApiProperty({
        required: true,
        description: 'The verification code',
        minLength: 6,
        maxLength: 6,
        example: '123456',
    })
    code: string;
}
