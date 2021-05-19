import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BackupModule } from './backup/backup.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }),
        ProductModule,
        CategoryModule,
        ProductTypeModule,
        BackupModule,
        AccountModule,
        AuthModule,
        FileModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
