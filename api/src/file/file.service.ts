import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
        // Inserting the image into sharp
        const sharpImage = await sharp(image.buffer);
        // Getting final image size
        const { height, width } = await sharpImage.metadata();
        let imageSize = Math.max(height || 2000, width || 2000);
        if (imageSize > 2000)
            imageSize = 2000;
        // Generating path data
        const imageID = nanoid(20);
        const storagePath = path.resolve('./storage/');
        const imagePath = path.resolve(storagePath, `${imageID}.png`);
        fs.mkdirSync(storagePath, { recursive: true });
        // Resising and saving the image
        sharpImage
            .rotate()
            .resize({
                width: imageSize,
                height: imageSize,
                fit: 'contain',
                withoutEnlargement: false,
                background: { r: 255, g: 255, b: 255, alpha: 0 },
            })
            .toFile(imagePath);
        return `${imageID}.png`;
    }


    deleteFile(file: string) {
        const { path, code } = this.resolveFilePath(file);
        if (code === 401)
            throw new UnauthorizedException();
        else if (code === 404)
            throw new NotFoundException();
        if (!path)
            throw new InternalServerErrorException('Cannot find file path');
        fs.unlinkSync(path);
    }
}
