import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { RecommendationEntity } from './entities/recommendation.entity';
import { UserRecommendationEntity } from './entities/user-recommendation.entity';
import { RecommendationService } from './recommendation.service';

@ApiTags('Recommendation')
@Controller('recommendation')
export class RecommendationController {
    constructor(private readonly RecommendationService: RecommendationService) {
    }

    @Get()
    @Auth(RoleEnum.USER)
    @ApiResponse({
        status: 200,
        description: 'The list of recommendations for the user\'s cart',
        type: [ UserRecommendationEntity ],
    })
    getUserCartRecommendations(@Request() { user }: RequestWithUserEntity) {
        return this.RecommendationService.userRecommendations(user);
    }

    @Post()
    @Auth(RoleEnum.ADMIN)
    @ApiResponse({
        status: 201,
        description: 'The created recommendation',
        type: RecommendationEntity,
    })
    createRecommendation(@Body() recommendation: CreateRecommendationDto) {
        return this.RecommendationService.createRecommendation(recommendation);
    }
}
