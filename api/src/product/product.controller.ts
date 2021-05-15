import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { AddProductDto } from './dto/add-product.dto';
import { AddProductWithImagesDto } from './dto/add-product-with-images.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { GetSingleProductParamsDto } from './dto/get-single-product-params.dto';
import { BasicProductEntity } from './entities/basic-product.entity';
import { HomeProductsEntity } from './entities/home-products.entity';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

@ApiTags('Product')
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

    @Get(':slug')
    @ApiResponse({
        status: 200,
        description: 'The details of the products',
        type: ProductEntity,
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found',
    })
    getProduct(@Param('slug') slug: string, @Query() { stat }: GetSingleProductParamsDto) {
        return this.productService.getProduct(slug, stat);
    }

    @Post()
    @Auth(RoleEnum.ADMIN)
    @UseInterceptors(FilesInterceptor('images', 5, {
        fileFilter(req: RequestWithUserEntity, file, cb) {
            cb(null, file.mimetype.startsWith('image/'));
        },
    }))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 200,
        description: 'The created product',
        type: ProductEntity,
    })
    @ApiBody({
        type: AddProductWithImagesDto,
    })
    addProduct(
        @Body() product: AddProductDto,
        @UploadedFiles() images: Express.Multer.File[],
    ) {
        return this.productService.addProduct(product, images);
    }
}
