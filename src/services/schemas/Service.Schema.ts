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

@MongooseSchema({ timestamps: true })
export class Service extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

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
}
export const ServiceSchema = SchemaFactory.createForClass(Service);
