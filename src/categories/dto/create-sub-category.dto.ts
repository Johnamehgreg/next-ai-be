import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  categoryId: string;
}
