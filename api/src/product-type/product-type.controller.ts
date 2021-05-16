import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { AddProductTypeDto } from './dto/add-product-type.dto';
import { ProductTypeEntity } from './entities/product-type.entity';
import { ProductTypeService } from './product-type.service';

@ApiTags('Product type')
@Controller('product-type')
export class ProdductTypeController {
    constructor(private readonly productTypeService: ProductTypeService) {
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'A list of the differents available product types',
        type: [ ProductTypeEntity ],
    })
    getCategories() {
        return this.productTypeService.getProductTypes();
    }

    @Post()
    @Auth(RoleEnum.ADMIN)
    @ApiResponse({
        status: 201,
        description: 'The created category',
        type: ProductTypeEntity,
    })
    addCategory(@Body() productType: AddProductTypeDto) {
        return this.productTypeService.addProductType(productType);
    }
}
