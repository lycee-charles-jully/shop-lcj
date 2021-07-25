import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { Response } from 'express';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { BackupService } from './backup.service';
import { DbBackupService } from './db-backup.service';
import { RestoreDbBackupDto } from './dto/restore-db-backup.dto';
import { RestoreFullBackupDto } from './dto/restore-full-backup.dto';
import { FilesBackupService } from './files-backup.service';
import * as Archiver from 'archiver';
import { Express } from 'express';


@Controller('backup')
@ApiTags('Backup')
@Auth(RoleEnum.ADMIN)
export class BackupController {

    constructor(
        private readonly DbBackupService: DbBackupService,
        private readonly FilesBackupService: FilesBackupService,
        private readonly BackupService: BackupService,
    ) {
    }

    @Get('db/get')
    @ApiResponse({
        status: 200,
        description: 'Get the database backup',
    })
    getDbBackup() {
        return this.DbBackupService.getBackup();
    }

    @Get('db/create')
    @ApiResponse({
        status: 200,
        description: 'Create a database backup that is stored on the server',
    })
    createDbBackup() {
        return this.DbBackupService.createBackup();
    }

    @Post('db/restore')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Imports a backup into the database',
    })
    restoreDbBackup(@Body() data: RestoreDbBackupDto) {
        return this.DbBackupService.restoreBackup(data);
    }

    @Get('files/get')
    getFilesBackup(@Res() res: Response) {
        const archive = Archiver('zip');
        res.attachment(`shoplcj_files_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`);
        archive.pipe(res);
        this.FilesBackupService.genBackup(archive);
        archive.finalize();
    }

    @Get('get')
    async getFullBackup(@Res() res: Response) {
        const archive = Archiver('zip');
        res.attachment(`shoplcj_files_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`);
        archive.pipe(res);
        await this.BackupService.genFullBackup(archive);
        await archive.finalize();
    }

    @Post('restore')
    @UseInterceptors(FileInterceptor('backup', {
        fileFilter(req: RequestWithUserEntity, file, cb) {
            cb(null, file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed');
        },
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: RestoreFullBackupDto,
    })
    async restoreFullBackup(@UploadedFile() file: Express.Multer.File) {
        if (!file)
            throw new BadRequestException('A backup file is required');
        return this.BackupService.restoreFullBackup(file);
    }
}
