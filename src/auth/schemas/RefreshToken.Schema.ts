import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class RefreshToken {
  @Prop({ required: true })
  token?: string;
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId?: string;
  @Prop({ required: true })
  expiryDate?: Date;
}
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
