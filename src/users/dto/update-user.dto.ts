/* eslint-disable prettier/prettier */
import {
  IsBoolean, IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsEmail
} from 'class-validator';

export class UpdateUserDto {
  static allowedFields = ['firstName', 'lastName', 'email', 'role'];
  @IsString()
  @IsOptional()
  firstName: string;
  @IsString()
  @IsOptional()
  lastName: string;
  @IsEmail()
  email: string;
  @IsEnum(['admin', 'user', 'editor'], {
    message: 'Invalid role. Please choose from admin, user, or editor.',
  })
  @IsOptional()
  role: 'admin' | 'user' | 'editor'; // Example roles

}


export class UpdateNotificationSettingsDto {
  static allowedFields = ['receiveNotification', 'receiveEmails', 'receiveSMS'];

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
  static allowedFields = ['businessName', 'country', 'businessAddress', 'businessPhoneNumber', 'businessLogo'];
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
  static allowedFields = ['businessName', 'regNumber', 'document'];
  @IsNotEmpty()
  @IsBoolean()
  businessName: string;

  @IsNotEmpty()
  @IsBoolean()
  regNumber: string;

  @IsNotEmpty()
  @IsBoolean()
  document: string;
}


