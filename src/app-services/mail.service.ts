import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) { }
  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:5173/login?resetToken=${token}`;
    const mailOptions = {
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to,
      subject: 'Password Reset',
      html: `
      <p>To reset your password, please click on the following link:</p>
      <a href="${resetLink}" target="_blank">Reset Password</a>
    `,
    };
    this.mailService.sendMail(mailOptions);
  }
  async sendPasswordUpdateSuccess(to: string) {
    const mailOptions = {
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to,
      subject: 'Password Reset',
      text: `Your password has been reset successfully `,
    };
    this.mailService.sendMail(mailOptions);
  }
  async sendVerificationEmail(to: string, otp) {
    const mailOptions = {
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to,
      subject: 'Email verification',
      text: `Your verification otp is ${otp}  `,
    };
    this.mailService.sendMail(mailOptions);
  }
}
