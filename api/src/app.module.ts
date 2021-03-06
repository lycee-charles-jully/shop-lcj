import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BackupModule } from './backup/backup.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { OrderModule } from './order/order.module';
import { EmailModule } from './email/email.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { AnnounceModule } from './announce/announce.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }),
        AuthModule,
        AccountModule,
        CartModule,
        OrderModule,
        ProductModule,
        CategoryModule,
        ProductTypeModule,
        RecommendationModule,
        AnnounceModule,
        FileModule,
        BackupModule,
        EmailModule,
        SitemapModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
