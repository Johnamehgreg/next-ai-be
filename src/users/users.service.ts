/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/User.schema';
import { UserSettings } from './schemas/UserSettings.schema';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name) private UserSettingsModel: Model<UserSettings>,
  ) { }

  findAll(role: string) {
    if (role) {
      // const roleList = this.users.filter((user) => user.role === role);
      // if (roleList.length === 0)
      //   throw new NotFoundException(`Role ${role} not found`);
      // return roleList;
    }
    return this.userModel.find().populate(['settings', 'posts', 'products']);
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
