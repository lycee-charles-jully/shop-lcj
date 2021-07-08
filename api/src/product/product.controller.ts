import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import * as mongoose from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { RequestWithUserEntity } from '../auth/entities/request-with-user.entity';
import { RoleEnum } from '../auth/enum/role.enum';
import { AddImagesToProductDto } from './dto/add-images-to-product.dto';
import { AddProductDto } from './dto/add-product.dto';
import { AddProductWithImagesDto } from './dto/add-product-with-images.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { GetSingleProductParamsDto } from './dto/get-single-product-params.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

    @Patch(':id')
    @ApiResponse({
        status: 200,
        description: 'The updated product',
        type: ProductEntity,
    })
    @Auth(RoleEnum.MANAGER)
    updateProduct(@Param('id') id: string, @Body() patch: UpdateProductDto) {
        if (!mongoose.isValidObjectId(id))
            throw new BadRequestException('The product ID is not valid');
        return this.productService.updateProduct(id, patch);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'The deleted product',
        type: ProductEntity,
    })
    @Auth(RoleEnum.MANAGER)
    deleteProduct(@Param('id') id: string, @Body() { name }: DeleteProductDto) {
        if (!mongoose.isValidObjectId(id))
            throw new BadRequestException('The product ID is not valid');
        return this.productService.deleteProduct(id, name);
    }

    @Post(':id/images')
    @Auth(RoleEnum.MANAGER)
    @UseInterceptors(FilesInterceptor('images', 10, {
        fileFilter(req: RequestWithUserEntity, file, cb) {
            cb(null, file.mimetype.startsWith('image/'));
        },
    }))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 200,
        description: 'The updated product',
        type: ProductEntity,
    })
    @ApiBody({
        type: AddImagesToProductDto,
    })
    addImagesToProduct(@Param('id') id: string, @UploadedFiles() images: Express.Multer.File[]) {
        if (!mongoose.isValidObjectId(id))
            throw new BadRequestException('The product ID is not valid');
        return this.productService.addImagesToProduct(id, images);
    }

    @Post()
    @Auth(RoleEnum.MANAGER)
    @UseInterceptors(FilesInterceptor('images', 10, {
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
