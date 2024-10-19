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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      user_id: user._id,
      email: user.email,
      role: user.role,
      iat: new Date().getTime(), // Current time
      access_token: await this.generateUserToken(payload),
    };
  }

  async generateUserToken(payload) {
    const accessToken = this.jwtService.sign(
      { ...payload },
      { expiresIn: '1h' },
    );
    return accessToken;
  }
}
