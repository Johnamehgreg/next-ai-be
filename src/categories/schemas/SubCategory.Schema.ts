import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({ required: true })
  name?: string;
  @Prop({ required: true })
  categoryId?: string;
}
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
