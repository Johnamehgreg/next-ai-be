import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
class createSettingsDto {
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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsEnum(['admin', 'user', 'editor'], {
    message: 'Invalid role. Please choose from admin, user, or editor.',
  })
  role: 'admin' | 'user' | 'editor'; // Example roles
  @IsOptional()
  @ValidateNested()
  @Type(() => createSettingsDto) // Use Type decorator for nested validation
  settings: createSettingsDto; // Example settings schema
  @IsString()
  @MinLength(8, {
    message: 'Password must contain at least 8 characters',
  })
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  password: string;
}
