import { ApiProperty } from '@nestjs/swagger';
import { AnnouncePositionEnum } from '../enum/announce-position.enum';

export class BasicAnnounceEntity {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    message: string;

    @ApiProperty({ enum: AnnouncePositionEnum })
    position: AnnouncePositionEnum;
}
