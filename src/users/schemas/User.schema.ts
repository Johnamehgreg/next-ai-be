import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from 'src/posts/schemas/Post.Schema';
import { Product } from 'src/products/schemas/Product.Schema';

@Schema()
class NotificationSettings {
  @Prop({ required: true })
  receiveNotification?: boolean;
  @Prop({ required: true })
  receiveEmails?: boolean;
  @Prop({ required: true })
  receiveSMS?: boolean;
}
const NotificationSettingsSchema =
  SchemaFactory.createForClass(NotificationSettings);
@Schema()
class BusinessInformationSettings {
  @Prop()
  businessName?: string;
  @Prop()
  country?: string;
  @Prop()
  businessAddress?: string;
  @Prop()
  businessPhoneNumber?: string;
  @Prop()
  businessLogo?: string;
}
const BusinessInformationSettingsSchema = SchemaFactory.createForClass(
  BusinessInformationSettings,
);
@Schema()
class BusinessVerificationSettings {
  @Prop({ default: false })
  isVerify?: boolean;
  @Prop()
  businessName?: string;
  @Prop()
  regNumber?: string;
  @Prop()
  document?: string;
}
const BusinessVerificationSettingsSchema = SchemaFactory.createForClass(
  BusinessVerificationSettings,
);

@Schema({ timestamps: true }) // Enable timestamps
export class User {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ required: true })
  role: string;
  @Prop({
    type: NotificationSettingsSchema,
    default: {
      receiveNotification: true,
      receiveEmails: true,
      receiveSMS: false,
    },
  })
  notificationSettings: NotificationSettings;
  @Prop({
    type: BusinessInformationSettingsSchema,
  })
  businessInformation: BusinessInformationSettings;
  @Prop({
    type: BusinessVerificationSettingsSchema,
  })
  businessVerification: BusinessVerificationSettings;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  })
  posts: Post[];
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  })
  products: Product[];
  @Prop({})
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    if (ret.notificationSettings) {
      delete ret.notificationSettings._id;
    }
    if (ret.businessInformation) {
      delete ret.businessInformation._id;
    }
    if (ret.businessVerification) {
      delete ret.businessVerification._id;
    }
    return ret;
  },
});

UserSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    if (ret.notificationSettings) {
      delete ret.notificationSettings._id;
    }
    if (ret.businessInformation) {
      delete ret.businessInformation._id;
    }
    if (ret.businessVerification) {
      delete ret.businessVerification._id;
    }
    return ret;
  },
});
