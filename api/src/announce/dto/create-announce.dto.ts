import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AnnouncePositionEnum } from '../enum/announce-position.enum';

export class CreateAnnounceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
    })
    message: string;

    @IsEnum(AnnouncePositionEnum)
    @ApiProperty({
        required: true,
        enum: AnnouncePositionEnum,
    })
    position: AnnouncePositionEnum;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
        default: true,
    })
    active: boolean;
}
