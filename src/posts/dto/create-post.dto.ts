import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  id: number | string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
}
