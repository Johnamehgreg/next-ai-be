/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserD } from '../schemas/User.schema';
import { Model } from 'mongoose';
import { UserSettings } from '../schemas/UserSettings.schema';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserD.name) private userModel: Model<UserD>,
    @InjectModel(UserSettings.name) private UserSettingsModel: Model<UserSettings>,
  ) { }

  async create({ settings, ...createUserDto }: CreateUserDto,) {
    const emailExit = await this.userModel.findOne({ email: createUserDto.email })
    if (emailExit) throw new HttpException('Email already exit', HttpStatus.BAD_REQUEST)
    if (settings) {
      const newSettings = new this.UserSettingsModel(settings)
      const saveSettings = await newSettings.save()
      const newUser = new this.userModel({
        ...createUserDto,
        settings: saveSettings._id
      })
      return (await newUser.save()).populate('settings');
      // createUserDto.settings = userSettings._id
    }
    const newUser = new this.userModel(createUserDto)
    return newUser.save();
  }
  findAll(role: string) {
    if (role) {
      // const roleList = this.users.filter((user) => user.role === role);
      // if (roleList.length === 0)
      //   throw new NotFoundException(`Role ${role} not found`);
      // return roleList;
    }
    return this.userModel.find().populate(['settings', 'posts']);
  }
  findOne(id: string) {
    return this.userModel.findById(id).populate(['settings', 'posts']);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
  delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
