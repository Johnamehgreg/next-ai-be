import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Otp {
  @Prop({ required: true })
  otp?: string;
  @Prop({})
  email?: string;
  @Prop()
  userId?: string;
  @Prop({ required: true })
  expiryDate?: Date;
  @Prop()
  isEmailVerify?: boolean;
}
export const OtpTokenSchema = SchemaFactory.createForClass(Otp);
