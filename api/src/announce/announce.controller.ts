import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { AnnounceService } from './announce.service';
import { CreateAnnounceDto } from './dto/create-announce.dto';
import { PopulatedAnnounceEntity } from './entities/populated-announce.entity';

@ApiTags('Announce')
@Controller('announce')
export class AnnounceController {

    constructor(private readonly AnnounceService: AnnounceService) {
    }

    @Get()
    @ApiResponse({
        status: 200,
        type: [ PopulatedAnnounceEntity ],
    })
    @Auth(RoleEnum.MANAGER)
    getAllAnnounces() {
        return this.AnnounceService.getAllAnnounces();
    }

    @Post()
    @ApiResponse({
        status: 201,
        type: PopulatedAnnounceEntity,
    })
    @Auth(RoleEnum.MANAGER)
    createAnnounce(@Body() details: CreateAnnounceDto, @User('_id') userID: string) {
        return this.AnnounceService.createAnnounce(userID, details);
    }
}
