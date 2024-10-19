import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title?: string;
  @Prop({ required: true })
  content?: string;
}
export const PostSchema = SchemaFactory.createForClass(Post);
