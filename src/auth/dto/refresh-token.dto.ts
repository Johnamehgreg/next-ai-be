import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  static allowedFields = ['token'];
  @IsString()
  @IsNotEmpty()
  token: string;
}
