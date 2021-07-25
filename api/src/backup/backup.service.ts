import { BadRequestException, Injectable } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { Archiver } from 'archiver';
import { Express } from 'express';
import { DbBackupService } from './db-backup.service';
import { BackupData } from './entities/backup.entity';
import { BackupOrigin } from './enum/BackupOrigin';
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


    async restoreFullBackup(file: Express.Multer.File) {
        const zip = new AdmZip(file.buffer);
        const dbBackup = zip.getEntry('db.json');
        if (!dbBackup)
            throw new BadRequestException('Canot get the file db.json inside the zip');
        let dbBackupData;
        try {
            dbBackupData = JSON.parse(dbBackup.getData().toString('utf-8')) as BackupData;
        } catch {
            throw new BadRequestException('Cannot parse the file db.json');
        }
        const [ dbBackupResult, dbFilesResult ] = await Promise.all([
            this.DbBackupService.restoreBackup({
                backup: { data: dbBackupData, origin: BackupOrigin.OVERWRITE, timestamp: Date.toString() },
                drop: true,
            }),
            this.FilesBackupService.restoreBackup(zip),
        ]);
        return {
            db: dbBackupResult,
            files: dbFilesResult,
        };
    }
}
