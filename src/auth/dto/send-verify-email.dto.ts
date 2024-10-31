import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendVerifyEmailDto {
  static allowedFields = ['email'];

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
