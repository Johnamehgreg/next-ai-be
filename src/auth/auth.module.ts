import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/User.schema';
import {
  UserSettings,
  userSettingsSchema,
} from 'src/users/schemas/UserSettings.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/RefreshToken.Schema';
import { ResetToken, ResetTokenSchema } from './schemas/ResetToken.Schema';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserSettings.name,
        schema: userSettingsSchema,
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
      {
        name: ResetToken.name,
        schema: ResetTokenSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule { }
