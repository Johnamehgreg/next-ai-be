import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/Product.Schema';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private PostModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }
  async create({ userId, ...createProductDto }: CreateProductDto) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const newProduct = new this.PostModel(createProductDto);
    const saveProduct = await newProduct.save();
    await findUser.updateOne({
      $push: {
        products: saveProduct._id,
      },
    });
    return saveProduct;
  }

  findAll() {
    return `This action returns all products`;
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
