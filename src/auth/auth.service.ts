import {
  BadRequestException,
  HttpException,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private ResetTokenModel: Model<ResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async signUp({ password, ...createUserDto }: CreateUserDto) {
    const emailExit = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (emailExit) throw new BadRequestException('Email already exit');
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      password: hashPassword,
      ...createUserDto,
    });
    return newUser.save();
  }

  async login(LoginDto: LoginDto) {
    // this.mailService.sendMail();
    const user = await this.userModel.findOne({
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
    const user = await this.userModel.findById(userId);
    const passwordMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!user) throw new NotFoundException('User not found...');
    if (!passwordMatch) throw new BadRequestException('Wrong credentials');
    const hashPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    const updatePassword = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: { password: hashPassword },
      },
      {
        upsert: true,
      },
    );
    if (updatePassword)
      throw new HttpException('Password update successfully', 200);
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });
    if (!user) throw new BadRequestException('wrong credential');
    const resetToken = nanoid(64);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getHours() + 1);
    await this.ResetTokenModel.create({
      token: resetToken,
      userId: user._id,
      expiryDate,
    });
    try {
      const response = await this.mailService.sendPasswordResetEmail(
        user.email,
        resetToken,
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
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
}
