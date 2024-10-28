import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Product } from './schemas/Product.Schema';
import { User } from 'src/users/schemas/User.schema';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { checkIdIsValid } from 'src/helper';
import { SubCategory } from 'src/categories/schemas/SubCategory.Schema';
import { Category } from 'src/categories/schemas/Category.Schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) { }
  async create({ ...createProductDto }: CreateProductDto, userId: string) {
    const findUser = await this.userModel.findById(userId);
    const findCategory = await this.categoryModel.findById(
      createProductDto.categoryId,
    );
    const findSubCategory = await this.subCategoryModel.findById(
      createProductDto.subCategoryId,
    );
    const isCategoryIdValid = mongoose.Types.ObjectId.isValid(
      createProductDto.categoryId,
    );
    if (!isCategoryIdValid)
      throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);
    const isSubCatorgoryIdValid = mongoose.Types.ObjectId.isValid(
      createProductDto.subCategoryId,
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
    const newProduct = new this.ProductModel({
      ...createProductDto,
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
    const data = await this.ProductModel.find().skip(skip).limit(limit);
    const totalCount = await this.ProductModel.countDocuments();
    return {
      data,
      currentPage: Math.ceil(skip / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  }

  async findOne(id: string) {
    checkIdIsValid(id);
    const detail = await this.ProductModel.findById(id);
    if (!detail)
      throw new HttpException('Product dose not exit', HttpStatus.NOT_FOUND);
    return detail;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    checkIdIsValid(id);
    const updatedProduct = await this.ProductModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    if (!updatedProduct)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return updatedProduct;
  }

  async remove(id: string) {
    checkIdIsValid(id);
    const deletedProduct = await this.ProductModel.findByIdAndDelete(id);
    if (!deletedProduct)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    throw new HttpException('Product delete successful', HttpStatus.OK);
  }
}
