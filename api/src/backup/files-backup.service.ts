import { Injectable } from '@nestjs/common';
import * as Archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class FilesBackupService {

    private readonly storagePath = path.resolve('./storage');

    genBackup(archive: Archiver.Archiver) {
        return this.getZipBackup(archive);
    }

    private getZipBackup(archive: Archiver.Archiver) {
        fs.readdirSync(this.storagePath).forEach(file => {
            archive.file(path.resolve(this.storagePath, file), { name: file });
        });
        return archive;
    }
}
