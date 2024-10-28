import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum mediaType {
  Product = 'image',
  Service = 'video',
}
class MediaDto {
  @IsString()
  url: string;
  @IsEnum(mediaType)
  type: 'image' | 'video';
}
class ProductDetailDto {
  @IsArray()
  color: string[];
  @IsString()
  brand: string;
  @IsString()
  type: string;
  @IsArray()
  size: number[];
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  discountPrice: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;

  @IsBoolean()
  @IsOptional()
  isPublish: boolean;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  @IsOptional()
  media: MediaDto[];
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailDto)
  @IsOptional()
  detail: ProductDetailDto;
}
