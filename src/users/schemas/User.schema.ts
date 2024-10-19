import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Enable timestamps
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  role: string;

  // The `timestamps: true` option automatically adds these fields:
  // createdAt: Date;
  // updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
