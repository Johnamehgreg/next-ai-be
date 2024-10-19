import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name?: string;
  @Prop({ required: true })
  description?: string;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
