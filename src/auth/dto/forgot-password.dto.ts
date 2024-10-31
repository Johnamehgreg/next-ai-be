import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  static allowedFields = ['email'];

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
