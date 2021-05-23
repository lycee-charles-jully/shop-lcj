import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../schemas/category.schema';
import { ProductTypeSchema } from '../schemas/product-type.schema';
import { ProductSchema } from '../schemas/product.schema';
import { RecommendationSchema } from '../schemas/recommendation.schema';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'product', schema: ProductSchema },
            { name: 'category', schema: CategorySchema },
            { name: 'product-type', schema: ProductTypeSchema },
            { name: 'recommendation', schema: RecommendationSchema },
        ]),
    ],
    controllers: [ RecommendationController ],
    providers: [ RecommendationService ],
})
export class RecommendationModule {
}
