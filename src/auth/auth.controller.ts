import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { SendVerifyEmailDto } from './dto/send-verify-email.dto';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard.ts/google-auth.guard.ts.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
  @Post('send-verification-email')
  sendOptVerificationEmail(@Body() sendVerifyEmailDto: SendVerifyEmailDto) {
    return this.authService.sendOptVerificationEmail(sendVerifyEmailDto);
  }
  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }
  @Post('login')
  login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() { }
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallBack(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.generateUserToken(
      req?.user?._id,
    );
    return res.redirect(`http://localhost:4000/token=${accessToken}`);
  }
  @UseGuards(AuthGuard)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
  @UseGuards(AuthGuard)
  @Put('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() reg) {
    return this.authService.changePassword(changePasswordDto, reg.userId);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
  @Put('reset-password')
  ResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
