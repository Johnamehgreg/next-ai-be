/* eslint-disable prettier/prettier */
import {
  IsBoolean, IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  receiveNotification: boolean;
  @IsOptional()
  @IsBoolean()
  receiveEmails: boolean;
  @IsOptional()
  @IsBoolean()
  receiveSMS: boolean;
}

export class UpdateBusinessInformationSettingsDto {
  @IsNotEmpty()
  @IsString()
  businessName: string;
  @IsNotEmpty()
  @IsString()
  country: string;
  @IsNotEmpty()
  @IsString()
  businessAddress: string;
  @IsNotEmpty()
  @IsString()
  businessPhoneNumber: string;
  @IsOptional()
  @IsString()
  businessLogo: string;
}

export class UpdateBusinessVerificationSettingsDto {
  @IsNotEmpty()
  @IsBoolean()
  businessName: boolean;
  @IsNotEmpty()
  @IsBoolean()
  RegNumber: boolean;
  @IsNotEmpty()
  @IsBoolean()
  document: boolean;
}
