import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/User.schema';
import { RefreshToken } from './schemas/RefreshToken.Schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { nanoid } from 'nanoid';
import { ResetToken } from './schemas/ResetToken.Schema';
import { MailService } from 'src/services/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserSettings } from 'src/users/schemas/UserSettings.schema';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Otp } from './schemas/Otp.Schema';
import { SendVerifyEmailDto } from './dto/send-verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(UserSettings.name)
    private UserSettingsModel: Model<UserSettings>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private ResetTokenModel: Model<ResetToken>,
    @InjectModel(Otp.name)
    private OtpModel: Model<Otp>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async signUp({ password, ...createUserDto }: CreateUserDto) {
    const emailExit = await this.UserModel.findOne({
      email: createUserDto.email,
    });
    if (emailExit) throw new BadRequestException('Email already exit');
    const check = await this.OtpModel.findOne({
      email: createUserDto.email,
    });
    if (!check?.isEmailVerify)
      throw new BadRequestException('Email is not verified');
    const settings = await this.UserSettingsModel.create({
      receiveNotification: true,
    });
    const hashedPassword = await this.generateHashedPassword(password);
    const newUser = new this.UserModel({
      ...createUserDto,
      password: hashedPassword,
      role: 'user',
      settings: settings._id,
    });
    const savedUser = await (await newUser.save()).populate('settings');

    // Convert to plain object and remove the password field
    const userObject = savedUser.toObject();
    delete userObject.password;

    return { message: 'Account created successfully' };
  }

  async sendOptVerificationEmail(sendVerifyEmailDto: SendVerifyEmailDto) {
    const otp = this.generateOtp();
    const hashedOtp = await this.generateHashedPassword(otp);
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);
    const user = await this.OtpModel.findOneAndUpdate(
      {
        email: sendVerifyEmailDto.email,
      },
      {
        $set: {
          otp: hashedOtp,
          expiryDate,
        },
      },
    );
    if (user) {
      this.mailService.sendVerificationEmail(sendVerifyEmailDto.email, otp);
      return { message: 'Verification email sent' };
    }
    const newOtp = new this.OtpModel({
      otp: hashedOtp,
      email: sendVerifyEmailDto.email,
      expiryDate,
    });
    await newOtp.save();
    this.mailService.sendVerificationEmail(sendVerifyEmailDto.email, otp);
    return { message: 'Verification email sent' };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    console.log(verifyEmailDto);
    const exitedOtp = await this.OtpModel.findOne({
      email: verifyEmailDto.email,
    });
    if (!exitedOtp) throw new BadRequestException('Invalid credentials');
    if ((exitedOtp?.expiryDate as any) < new Date())
      throw new BadRequestException('Code has expired, Please request again');
    const validOtp = await bcrypt.compare(verifyEmailDto.otp, exitedOtp.otp);
    if (!validOtp)
      throw new BadRequestException('Invalid code passed, check your inbox');
    await this.OtpModel.findOneAndUpdate(
      { email: verifyEmailDto.email },
      {
        $set: {
          isEmailVerify: true,
          otp: '',
        },
      },
    );
    throw new HttpException(`Email verification Successful`, 200);
  }

  async login(LoginDto: LoginDto) {
    const user = await this.UserModel.findOne({
      email: LoginDto.email,
    });
    if (!user) throw new UnauthorizedException('Invalid login');
    const passwordMatch = await bcrypt.compare(
      LoginDto.password,
      user.password,
    );
    if (!passwordMatch) throw new UnauthorizedException('Invalid login');
    const token = await this.generateUserToken(user?._id);
    return {
      user_id: user._id,
      email: user.email,
      role: user.role,
      ...token,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshTokenDto.token,
      expiryDate: { $gte: new Date() },
    });
    if (!token) throw new UnauthorizedException('token is invalid');
    return this.generateUserToken(token.userId);
  }
  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const user = await this.UserModel.findById(userId);
    const passwordMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!user) throw new NotFoundException('User not found...');
    if (!passwordMatch) throw new BadRequestException('Wrong credentials');
    const hashedPassword = await this.generateHashedPassword(
      changePasswordDto.newPassword,
    );

    const updatePassword = await this.UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedPassword,
        },
      },
      {
        upsert: true,
      },
    );
    if (updatePassword)
      throw new HttpException('Password update successfully', 200);
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.UserModel.findOne({
      email: forgotPasswordDto.email,
    });
    if (!user) throw new BadRequestException('wrong credential');

    const token = await this.ResetTokenModel.findOne({
      userId: user._id,
    });
    const resetToken = nanoid(64);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getHours() + 1);
    if (token) {
      await this.ResetTokenModel.findByIdAndUpdate(
        token._id,
        {
          $set: {
            token: resetToken,
            userId: user._id,
            expiryDate,
          },
        },
        {
          upsert: true,
        },
      );
    } else {
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });
    }

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);
    throw new HttpException(
      `If email exit an reset link has been sent ${resetToken} `,
      200,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const resetTokenData = await this.ResetTokenModel.findOneAndDelete({
      token: resetPasswordDto.resetToken,
    });
    if (!resetTokenData) throw new UnauthorizedException('Invalid link');
    const hashedPassword = await this.generateHashedPassword(
      resetPasswordDto.newPassword,
    );
    const user = await this.UserModel.findByIdAndUpdate(
      resetTokenData.userId,
      {
        $set: {
          password: hashedPassword,
        },
      },
      {
        upsert: true,
      },
    );
    if (!user) {
      throw new InternalServerErrorException('Something went wrong');
    }
    await this.mailService.sendPasswordUpdateSuccess(user.email);
    throw new HttpException(`Password update successful `, 200);
  }

  async generateUserToken(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = nanoid(64);
    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: string) {
    // calculate for three days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.RefreshTokenModel.updateOne(
      { userId },
      {
        $set: { token, expiryDate },
      },
      {
        upsert: true,
      },
    );
  }

  generateHashedPassword(password) {
    return bcrypt.hash(password, 10);
  }

  generateOtp() {
    return `${Math.floor(10000 + Math.random() * 9000)}`;
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.UserModel.findOne({
      email: googleUser.email,
    });
    if (user) return user;
    return await this.UserModel.create(googleUser);
  }
}
