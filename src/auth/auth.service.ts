import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/User.schema';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './schemas/RefreshToken.Schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
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
    const user = await this.userModel.findOne({
      email: LoginDto.email,
    });
    if (!user) throw new UnauthorizedException('Invalid login');
    const passwordMatch = await bcrypt.compare(
      LoginDto.password,
      user.password,
    );
    if (!passwordMatch) throw new UnauthorizedException('Invalid login');
    return {
      user_id: user._id,
      email: user.email,
      role: user.role,
      iat: new Date().getTime(), // Current time
      accessToken: (await this.generateUserToken(user?._id)).accessToken,
      refreshToken: (await this.generateUserToken(user?._id)).refreshToken,
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

  async generateUserToken(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();
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
    const newRefreshToken = new this.RefreshTokenModel({
      token,
      userId, // replace with actual user id
      expiryDate,
    });
    return newRefreshToken;
  }
}
