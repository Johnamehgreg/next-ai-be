import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
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

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
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
}
