import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';
import { SubCategory } from './SubCategory.Schema';
import mongoose from 'mongoose';
import { CategoryType } from '../dto/create-category.dto';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name?: string;
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
  })
  subCategories?: SubCategory[];
  @Prop({ type: String, enum: CategoryType, required: true })
  type: CategoryType;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
