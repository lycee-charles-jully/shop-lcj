import { Injectable } from '@nestjs/common';
import * as Archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';


@Injectable()
export class FilesBackupService {

    private readonly storagePath = path.resolve('./storage');

    genBackup(archive: Archiver.Archiver) {
        return this.getZipBackup(archive);
    }


    restoreBackup(zip: AdmZip, deleteDbBackup = false) {
        fs.mkdirSync(this.storagePath, { recursive: true });
        zip.extractAllTo(this.storagePath, true);
        if (deleteDbBackup && fs.existsSync(path.resolve(this.storagePath, 'db.json')))
            fs.unlinkSync(path.resolve(this.storagePath, 'db.json'));
        return { success: true, filesCount: zip.getEntries().length - (+deleteDbBackup) };
    }

    private getZipBackup(archive: Archiver.Archiver) {
        fs.readdirSync(this.storagePath).forEach(file => {
            archive.file(path.resolve(this.storagePath, file), { name: file });
        });
        return archive;
    }
}
