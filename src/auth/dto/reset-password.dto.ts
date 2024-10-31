import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  static allowedFields = ['resetToken', 'newPassword'];
  @IsString()
  @IsNotEmpty()
  resetToken: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must contain at least 8 characters',
  })
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  newPassword: string;
}
