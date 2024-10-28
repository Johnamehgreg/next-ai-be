import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, Schema as MongooseSchema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@MongooseSchema({ timestamps: true })
export class Media {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ['image', 'video'] })
  type: 'image' | 'video';
}
export const MediaSchema = SchemaFactory.createForClass(Media);

@MongooseSchema()
export class ProductDetail {
  @Prop({ type: [String], required: true })
  color: string[];
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: [Number], required: true })
  size: number[];
}
export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail);

@MongooseSchema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discountPrice?: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  categoryId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  subCategoryId: string;

  @Prop({ default: false })
  isPublish?: boolean;

  @Prop({ type: [MediaSchema], default: [] })
  media?: Media[];

  @Prop({ type: ProductDetailSchema, default: {} })
  detail?: ProductDetail;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
