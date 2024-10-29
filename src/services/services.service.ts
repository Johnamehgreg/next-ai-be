import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/User.schema';
import mongoose, { Model } from 'mongoose';
import { SubCategory } from 'src/categories/schemas/SubCategory.Schema';
import { Category } from 'src/categories/schemas/Category.Schema';
import { Service } from './schemas/Service.Schema';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { checkIdIsValid } from 'src/helper';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private ServiceModel: Model<Service>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) { }
  async create(createServiceDto: CreateServiceDto, userId: string) {
    const findUser = await this.userModel.findById(userId);
    const findCategory = await this.categoryModel.findById(
      createServiceDto.categoryId,
    );
    const findSubCategory = await this.subCategoryModel.findById(
      createServiceDto.subCategoryId,
    );
    const isCategoryIdValid = mongoose.Types.ObjectId.isValid(
      createServiceDto.categoryId,
    );
    if (!isCategoryIdValid)
      throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);
    const isSubCatorgoryIdValid = mongoose.Types.ObjectId.isValid(
      createServiceDto.subCategoryId,
    );
    if (!isSubCatorgoryIdValid)
      throw new HttpException('Invalid sub categoryId', HttpStatus.BAD_REQUEST);
    if (!findCategory)
      throw new HttpException('Category does not exit', HttpStatus.BAD_REQUEST);
    if (!findSubCategory)
      throw new HttpException(
        'Sub category does not exit',
        HttpStatus.BAD_REQUEST,
      );
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    const newProduct = new this.ServiceModel({
      ...createServiceDto,
      userId: findUser._id,
    });
    const saveProduct = await newProduct.save();
    await findUser.updateOne({
      $push: {
        products: saveProduct._id,
      },
    });
    return saveProduct;
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { skip = 0, limit = DEFAULT_PAGE_SIZE } = paginationDTO;
    const data = await this.ServiceModel.find().skip(skip).limit(limit);
    const totalCount = await this.ServiceModel.countDocuments();
    return {
      data,
      currentPage: Math.ceil(skip / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  }

  async findOne(id: string) {
    checkIdIsValid(id);
    const detail = await this.ServiceModel.findById(id);
    if (!detail)
      throw new HttpException('Product dose not exit', HttpStatus.NOT_FOUND);
    return detail;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    checkIdIsValid(id);
    const updatedProduct = await this.ServiceModel.findByIdAndUpdate(
      id,
      updateServiceDto,
      { new: true },
    );
    if (!updatedProduct)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return updatedProduct;
  }

  async remove(id: string) {
    checkIdIsValid(id);
    const deletedProduct = await this.ServiceModel.findByIdAndDelete(id);
    if (!deletedProduct)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    throw new HttpException('Product delete successful', HttpStatus.OK);
  }
}
