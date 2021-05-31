import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/add-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity, CategoryWithProductsEntity } from './entities/category.entity';

@ApiTags('Category')
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

    @Post()
    @Auth(RoleEnum.MANAGER)
    @ApiResponse({
        status: 201,
        description: 'The created category',
        type: CategoryEntity,
    })
    addCategory(@Body() category: AddCategoryDto) {
        return this.categoryService.addCategory(category);
    }

    @Patch(':id')
    @Auth(RoleEnum.MANAGER)
    @ApiResponse({
        status: 200,
        description: 'The updated category',
        type: CategoryEntity,
    })
    updateCategory(@Param('id') id: string, @Body() patch: UpdateCategoryDto) {
        if (!mongoose.isValidObjectId(id))
            throw new BadRequestException('Invalid category ID');
        return this.categoryService.updateCategory(id, patch);
    }
}
