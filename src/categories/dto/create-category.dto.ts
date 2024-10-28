import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum CategoryType {
  Product = 'product',
  Service = 'service',
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;
}
