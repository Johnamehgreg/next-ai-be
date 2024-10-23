/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/User.schema';
import { UserSettings } from './schemas/UserSettings.schema';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { PaginationDTO } from 'src/dto/pagination.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name) private UserSettingsModel: Model<UserSettings>,
  ) { }

  async findAll(paginationDTO: PaginationDTO) {
    const { skip = 0, limit = DEFAULT_PAGE_SIZE } = paginationDTO;

    const data = await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate(['settings', 'posts', 'products']);

    const totalCount = await this.userModel.countDocuments();

    return {
      data,
      currentPage: Math.ceil(skip / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  }
  findOne(id: string) {
    return this.userModel.findById(id).populate(['settings', 'posts', 'products']);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
  delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
