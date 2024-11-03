/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateBusinessInformationSettingsDto, UpdateBusinessVerificationSettingsDto, UpdateNotificationSettingsDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/User.schema';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { checkIdIsValid } from 'src/helper';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async findAll(paginationDTO: PaginationDTO) {
    const { skip = 0, limit = DEFAULT_PAGE_SIZE } = paginationDTO;

    const data = await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate(['posts', 'products']).select('-password');

    const totalCount = await this.userModel.countDocuments();

    return {
      data,
      currentPage: Math.ceil(skip / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  }
  async findOne(id: string) {
    checkIdIsValid(id)
    const userDetail = await this.userModel.findById(id).populate(['posts', 'products']).select('-password');
    if (!userDetail)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return userDetail;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    checkIdIsValid(id)
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password');
    if (!updatedUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    return updatedUser
  }
  async delete(id: string) {
    checkIdIsValid(id)
    const deletedUser = await this.userModel.findByIdAndDelete(id).select('-password');
    if (!deletedUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    throw new HttpException('User delete successful', HttpStatus.OK)
  }

  async updateUserNotificationSettings(id: string, updateSettingsDto: UpdateNotificationSettingsDto) {
    checkIdIsValid(id)

    const updatedUserNotificationSettings = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: Object.fromEntries(
          Object.entries(updateSettingsDto).map(([key, value]) => [
            `notificationSettings.${key}`,
            value,
          ])
        ),
      },
      {
        new: true,
        upsert: true,
      },
    );
    if (!updatedUserNotificationSettings) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    return updatedUserNotificationSettings
  }
  async updateUserBusinessInformationSettings(id: string, updateSettingsDto: UpdateBusinessInformationSettingsDto) {
    checkIdIsValid(id)
    const updatedUserNotificationSettings = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: Object.fromEntries(
          Object.entries(updateSettingsDto).map(([key, value]) => [
            `businessInformation.${key}`,
            value,
          ])
        ),
      },
      {
        new: true,
        upsert: true,
      },
    );
    if (!updatedUserNotificationSettings) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    return updatedUserNotificationSettings
  }
  async updateUserBusinessVerificationSettings(id: string, updateSettingsDto: UpdateBusinessVerificationSettingsDto) {
    checkIdIsValid(id)
    const updatedUserNotificationSettings = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: Object.fromEntries(
          Object.entries(updateSettingsDto).map(([key, value]) => [
            `businessVerification.${key}`,
            value,
          ])
        ),
      },
      {
        new: true,
        upsert: true,
      },
    );
    if (!updatedUserNotificationSettings) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    return updatedUserNotificationSettings
  }
}
