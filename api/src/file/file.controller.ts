import { Controller, Get, InternalServerErrorException, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileService } from './file.service';

@ApiTags('Files')
@Controller('file')
export class FileController {

    constructor(private readonly FileService: FileService) {
    }

    @Get(':file')
    getFile(@Param('file') file: string, @Res() res: Response) {
        const { code, path } = this.FileService.resolveFilePath(file);
        if (code === 401)
            return res.status(404).json({
                statusCode: 401,
                error: 'Unauthorized',
            });
        if (code === 404)
            return res.status(404).json({
                statusCode: 404,
                message: 'File not found',
                error: 'Not Found',
            });
        if (!path)
            throw new InternalServerErrorException();
        res.sendFile(path, (err: Error & { status: number }) => {
            if (err) {
                if (err.status === 404)
                    return res.status(404).json({
                        statusCode: 404,
                        message: 'File not found',
                        error: 'Not Found',
                    });
                else
                    throw err;
            }
        });
    }
}
