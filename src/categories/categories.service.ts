import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/Category.Schema';
import { Model } from 'mongoose';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { SubCategory } from './schemas/SubCategory.Schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategory>,
  ) { }
  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.CategoryModel.findOne({
      name: createCategoryDto.name,
    }).exec();
    if (existingCategory)
      throw new BadRequestException('Category name already exists');
    const newCategory = new this.CategoryModel(createCategoryDto);
    const saveProduct = await newCategory.save();
    return saveProduct;
  }
  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto) {
    const existingCategory = await this.SubCategoryModel.findOne({
      name: createSubCategoryDto.name,
    }).exec();
    if (existingCategory)
      throw new BadRequestException('Sub category name already exists');
    const findCategory = await this.CategoryModel.findById(
      createSubCategoryDto.categoryId,
    );
    const newCategory = new this.SubCategoryModel({
      ...createSubCategoryDto,
      type: findCategory.type,
    });

    if (!findCategory) throw new BadRequestException('Invalid category id');
    const saveCategory = await newCategory.save();
    await findCategory.updateOne({
      $push: {
        subCategories: saveCategory._id,
      },
    });
    return saveCategory;
  }

  async findAll() {
    return await this.CategoryModel.find().populate('subCategories');
  }
  async findAllSubCategory() {
    return await this.SubCategoryModel.find();
  }

  async findOneSubCategory(id: string) {
    const subCategory = await this.SubCategoryModel.findById(id);
    if (!subCategory) throw new NotFoundException('Cannot find sub category');
    return subCategory;
  }
  async findOne(id: string) {
    const category = await this.CategoryModel.findById(id).populate([
      'subCategories',
    ]);
    if (!category) throw new NotFoundException('Cannot find category');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.CategoryModel.findById(id);
    if (!category) throw new NotFoundException('Cannot find category');
    const existingCategory = await this.CategoryModel.findOne({
      name: updateCategoryDto.name,
    }).exec();
    if (existingCategory)
      throw new BadRequestException('Category name already exists');
    return this.CategoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    }).populate('subCategories');
  }
  async updateSubCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.SubCategoryModel.findById(id);
    if (!category) throw new NotFoundException('Cannot find sub category');
    const existingCategory = await this.SubCategoryModel.findOne({
      name: updateCategoryDto.name,
    }).exec();
    if (existingCategory)
      throw new BadRequestException('Sub category name already exists');
    return this.SubCategoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    }).populate('subCategories');
  }

  async remove(id: string) {
    const category = await this.CategoryModel.findByIdAndDelete(id);
    if (!category) throw new NotFoundException('Cannot find category');
    throw new HttpException('Category delete successful', HttpStatus.OK);
  }
  async removeSubCategory(id: string) {
    const category = await this.SubCategoryModel.findByIdAndDelete(id);
    if (!category) throw new NotFoundException('Cannot sub find category');
    throw new HttpException('Sub category delete successful', HttpStatus.OK);
  }
}
