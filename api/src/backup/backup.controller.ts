import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { Response } from 'express';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { BackupService } from './backup.service';
import { DbBackupService } from './db-backup.service';
import { RestoreBackupDto } from './dto/restore-backup.dto';
import { FilesBackupService } from './files-backup.service';
import * as Archiver from 'archiver';


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
    restoreDbBackup(@Body() data: RestoreBackupDto) {
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
    @Auth(RoleEnum.ADMIN)
    async getFullBackup(@Res() res: Response) {
        const archive = Archiver('zip');
        res.attachment(`shoplcj_files_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`);
        archive.pipe(res);
        await this.BackupService.genFullBackup(archive);
        await archive.finalize();
    }
}
