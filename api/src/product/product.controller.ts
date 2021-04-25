import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { BasicProductEntity } from './entities/basic-product.entity';
import { HomeProductsEntity } from './entities/home-products.entity';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'A list of the products without all the fields',
        type: [ BasicProductEntity ],
    })
    getProducts(@Query() filters: GetProductsFilterDto) {
        return this.productService.getProducts(filters);
    }

    @Get('home')
    @ApiResponse({
        status: 200,
        description: 'A list of popular and latest products',
        type: HomeProductsEntity,
    })
    getHomeProducts() {
        return this.productService.getHomeProducts();
    }

    @Post()
    @ApiResponse({
        status: 200,
        description: 'The created product',
        type: [ BasicProductEntity ],
    })
    addProduct(@Body() product: AddProductDto) {
        return this.productService.addProduct(product);
    }
}
