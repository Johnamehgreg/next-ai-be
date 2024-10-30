import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/User.schema';

import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/RefreshToken.Schema';
import { ResetToken, ResetTokenSchema } from './schemas/ResetToken.Schema';
import { Otp, OtpTokenSchema } from './schemas/Otp.Schema';
import googleOauthConfig from 'src/config/google-oauth.config';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from 'src/stratagies/google.strategy';
import { MailService } from 'src/app-services/mail.service';

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
      {
        name: ResetToken.name,
        schema: ResetTokenSchema,
      },
      {
        name: Otp.name,
        schema: OtpTokenSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, GoogleStrategy],
})
export class AuthModule { }
