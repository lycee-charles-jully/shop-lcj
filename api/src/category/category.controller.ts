import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/add-category.dto';
import { CategoryEntity, CategoryWithProductsEntity } from './entities/category.entity';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'The list of the available categories',
        type: [ CategoryWithProductsEntity ],
    })
    getCategories() {
        return this.categoryService.getCategories();
    }

    @Post('new')
    @ApiResponse({
        status: 201,
        description: 'The created category',
        type: CategoryEntity,
    })
    addCategory(@Body() category: AddCategoryDto) {
        return this.categoryService.addCategory(category);
    }
}
