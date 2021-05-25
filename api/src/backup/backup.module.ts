import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../schemas/category.schema';
import { OrderSchema } from '../schemas/order.schema';
import { ProductTypeSchema } from '../schemas/product-type.schema';
import { ProductSchema } from '../schemas/product.schema';
import { RecommendationSchema } from '../schemas/recommendation.schema';
import { UserSchema } from '../schemas/user.schema';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'category', schema: CategorySchema },
            { name: 'order', schema: OrderSchema },
            { name: 'product', schema: ProductSchema },
            { name: 'product-type', schema: ProductTypeSchema },
            { name: 'recommendation', schema: RecommendationSchema },
            { name: 'user', schema: UserSchema },
        ]),
    ],
    controllers: [ BackupController ],
    providers: [ BackupService ],
})
export class BackupModule {
}
