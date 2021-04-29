import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmptyObject, IsOptional } from 'class-validator';
import { BackupEntity } from '../entities/backup.entity';

export class RestoreBackupDto {
    @IsNotEmptyObject()
    @ApiProperty({
        required: true,
        description: 'The backup data',
    })
    backup: BackupEntity;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
        description: 'If true, a backup of the current data will be issued and the database will be dropped before insertion',
        default: false,
    })
    drop: boolean = false;
}
