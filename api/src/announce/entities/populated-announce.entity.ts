import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';
import { BasicAnnounceEntity } from './basic-announce.entity';

export class PopulatedAnnounceEntity extends BasicAnnounceEntity {
    @ApiProperty({ type: Object })
    createdBy: User;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    active: boolean;
}
