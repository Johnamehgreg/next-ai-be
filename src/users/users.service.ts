/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserD } from './schemas/User.schema';
import { Model } from 'mongoose';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor'; // Example roles
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserD.name) private userModel: Model<UserD>) { }
  private users = [];
  findAll(role: string) {
    if (role) {
      const roleList = this.users.filter((user) => user.role === role);
      if (roleList.length === 0)
        throw new NotFoundException(`Role ${role} not found`);
      return roleList;
    }
    return this.userModel.find();
  }
  findOne(id: string) {
    return this.userModel.findById(id);
  }
  async create(createUserDto: CreateUserDto,) {
    const emailExit = await this.userModel.findOne({ email: createUserDto.email })
    if (emailExit) throw new HttpException('Email already exit', HttpStatus.BAD_REQUEST)
    const newUser = new this.userModel(createUserDto)
    return newUser.save();
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
  delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
