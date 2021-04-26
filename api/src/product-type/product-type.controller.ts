import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductTypeEntity } from './entities/product-type.entity';
import { ProductTypeService } from './product-type.service';
import { AddProductTypeDto } from './dto/add-product-type.dto';

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

    @ApiResponse({
        status: 201,
        description: 'The created category',
        type: ProductTypeEntity,
    })
    @Post('new')
    addCategory(@Body() productType: AddProductTypeDto) {
        return this.productTypeService.addProductType(productType);
    }
}
