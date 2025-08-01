import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
}
