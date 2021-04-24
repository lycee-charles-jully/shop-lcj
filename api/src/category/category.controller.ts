import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/add-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {
    }

    @Get()
    getCategories() {
        return this.categoryService.getCategories();
    }

    @Post('new')
    addCategory(@Body() category: AddCategoryDto) {
        return this.categoryService.addCategory(category);
    }
}
