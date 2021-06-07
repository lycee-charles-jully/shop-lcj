import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { OrderSchema } from '../schemas/order.schema';
import { ProductSchema } from '../schemas/product.schema';
import { RecommendationSchema } from '../schemas/recommendation.schema';
import { UserSchema } from '../schemas/user.schema';
import { OrderAdminService } from './order-admin.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'user', schema: UserSchema },
            { name: 'product', schema: ProductSchema },
            { name: 'order', schema: OrderSchema },
            { name: 'recommendation', schema: RecommendationSchema },
        ]),
        EmailModule,
    ],
    controllers: [ OrderController ],
    providers: [ OrderService, OrderAdminService ],
})
export class OrderModule {
}
