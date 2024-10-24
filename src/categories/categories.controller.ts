import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }
  @Post('sub-category')
  createSubCategory(
    @Body(ValidationPipe) createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.categoriesService.createSubCategory(createSubCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
  @Get('sub-categories')
  findAllSubCategory() {
    return this.categoriesService.findAllSubCategory();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }
  @Get('sub-categories/:id')
  findOneSubCategory(@Param('id') id: string) {
    return this.categoriesService.findOneSubCategory(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
  @Put('sub-categories/:id')
  updateSubCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateSubCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
  @Delete('sub-categories/:id')
  removeSubCategory(@Param('id') id: string) {
    return this.categoriesService.removeSubCategory(id);
  }
}
