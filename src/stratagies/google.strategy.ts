import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { UserSettings } from 'src/users/schemas/UserSettings.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
    @InjectModel(UserSettings.name)
    private UserSettingsModel: Model<UserSettings>,
  ) {
    super({
      clientID: googleConfiguration.clinetID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const settings = await this.UserSettingsModel.create({
      receiveNotification: true,
    });
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      firstName: profile?.name?.givenName,
      lastName: profile?.name?.familyName,
      password: '',
      settings: settings._id,
      role: 'user',
    });
    return user;
    // done(null, user);
  }
}
