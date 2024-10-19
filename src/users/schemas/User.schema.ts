import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserSettings } from './UserSettings.schema';
import { Post } from 'src/posts/schemas/Post.Schema';
import { Product } from 'src/products/schemas/Product.Schema';

@Schema({ timestamps: true }) // Enable timestamps
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ required: true })
  role: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSettings' })
  settings: UserSettings;
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
  @Prop()
  password: string;

  // The `timestamps: true` option automatically adds these fields:
  // createdAt: Date;
  // updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
