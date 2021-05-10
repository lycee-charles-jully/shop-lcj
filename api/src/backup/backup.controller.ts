import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { BackupService } from './backup.service';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@ApiTags('Backup')
@Controller('backup')
export class BackupController {

    constructor(private readonly BackuoService: BackupService) {
    }

    @Get('get')
    @Auth(RoleEnum.ADMIN)
    @ApiResponse({
        status: 200,
        description: 'Get the database backup',
    })
    getBackup() {
        return this.BackuoService.getBackup();
    }

    @Get('create')
    @Auth(RoleEnum.ADMIN)
    @ApiResponse({
        status: 200,
        description: 'Create a database backup that is stored on the server',
    })
    createBackup() {
        return this.BackuoService.createBackup();
    }

    @Post('restore')
    @Auth(RoleEnum.ADMIN)
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Imports a backup into the database',
    })
    restoreBackup(@Body() data: RestoreBackupDto) {
        return this.BackuoService.restoreBackup(data);
    }
}
