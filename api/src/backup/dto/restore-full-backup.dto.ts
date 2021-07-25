import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class RestoreFullBackupDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'The zip file containing a backup',
    })
    backup: Express.Multer.File;
}