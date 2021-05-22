import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { nanoid } from 'nanoid';

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


    async saveProductImage(image: Express.Multer.File) {
        const imageID = nanoid(20);
        const storagePath = path.resolve('./storage/');
        const imagePath = path.resolve(storagePath, `${imageID}.png`);
        fs.mkdirSync(storagePath, { recursive: true });
        await sharp(image.buffer)
            .rotate()
            .resize({
                width: 2000,
                height: 2000,
                fit: 'contain',
                withoutEnlargement: true,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .toFile(imagePath);
        return `${imageID}.png`;
    }
}
