import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  id: number | string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsEnum(['admin', 'user', 'editor'], {
    message: 'Invalid role. Please choose from admin, user, or editor.',
  })
  role: 'admin' | 'user' | 'editor'; // Example roles
}
