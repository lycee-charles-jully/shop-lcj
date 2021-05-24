import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductTypeSchema } from '../schemas/product-type.schema';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'product-type', schema: ProductTypeSchema },
        ]),
    ],
    controllers: [ ProductTypeController ],
    providers: [ ProductTypeService ],
})
export class ProductTypeModule {
}
