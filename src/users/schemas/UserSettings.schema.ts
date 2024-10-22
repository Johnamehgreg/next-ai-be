import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UserSettings {
  @Prop({ required: true })
  receiveNotification?: boolean;
  @Prop({ required: false })
  receiveEmails?: boolean;
  @Prop({ required: false })
  receiveSMS?: boolean;
}
export const userSettingsSchema = SchemaFactory.createForClass(UserSettings);
