import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';
import { CategoryType } from '../dto/create-category.dto';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({ required: true })
  name?: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  categoryId?: string;
  @Prop({ type: String, enum: CategoryType, required: true })
  type: CategoryType;
}
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
