import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {
    }

    @Get()
    getProducts(@Query() filters: GetProductsFilterDto) {
        return this.productService.getProducts(filters);
    }

    @Get('home')
    getHomeProducts() {
        return this.productService.getHomeProducts();
    }

    @Post()
    addProduct(@Body() product: AddProductDto) {
        return this.productService.addProduct(product);
    }
}
