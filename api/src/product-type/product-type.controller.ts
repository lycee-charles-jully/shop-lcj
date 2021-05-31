import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { AddProductTypeDto } from './dto/add-product-type.dto';
import { ProductTypeEntity } from './entities/product-type.entity';
import { ProductTypeService } from './product-type.service';

@ApiTags('Product type')
@Controller('product-type')
export class ProductTypeController {
    constructor(private readonly productTypeService: ProductTypeService) {
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'A list of the differents available product types',
        type: [ ProductTypeEntity ],
    })
    getProductType() {
        return this.productTypeService.getProductTypes();
    }

    @Post()
    @Auth(RoleEnum.MANAGER)
    @ApiResponse({
        status: 201,
        description: 'The created product type',
        type: ProductTypeEntity,
    })
    addProductType(@Body() productType: AddProductTypeDto) {
        return this.productTypeService.addProductType(productType);
    }
}
