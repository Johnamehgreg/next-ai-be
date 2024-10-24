import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';
import { SubCategory } from './SubCategory.Schema';
import mongoose from 'mongoose';

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
}
export const CategorySchema = SchemaFactory.createForClass(Category);
