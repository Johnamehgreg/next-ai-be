import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/Product.Schema';
import { User } from 'src/users/schemas/User.schema';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { PaginationDTO } from 'src/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }
  async create({ ...createProductDto }: CreateProductDto, userId: string) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const newProduct = new this.ProductModel(createProductDto);
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
