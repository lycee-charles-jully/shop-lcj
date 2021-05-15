import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
    resolveFilePath(file: string): { code: number, path: string | null } {
        file = file.replace(/(\/|%2F)/g, '');
        const filePath = path.resolve(`./storage/${file}`);
        const storagePath = path.resolve('./storage');
        const ext = path.extname(filePath);
        if (ext !== '.png')
            return { code: 401, path: null };
        if (!filePath.startsWith(storagePath))
            return { code: 401, path: null };
        if (!fs.existsSync(filePath))
            return { code: 404, path: null };
        return { code: 200, path: filePath };
    }
}
