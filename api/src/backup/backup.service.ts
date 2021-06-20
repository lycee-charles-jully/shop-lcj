import { Injectable } from '@nestjs/common';
import { Archiver } from 'archiver';
import { DbBackupService } from './db-backup.service';
import { FilesBackupService } from './files-backup.service';

@Injectable()
export class BackupService {
    constructor(
        private readonly DbBackupService: DbBackupService,
        private readonly FilesBackupService: FilesBackupService,
    ) {
    }


    async genFullBackup(archive: Archiver) {
        this.FilesBackupService.genBackup(archive);
        const dbBackup = await this.DbBackupService.getBackup();
        archive.append(JSON.stringify(dbBackup, null, 2), { name: 'db.json' });
    }
}
