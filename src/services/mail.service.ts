import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) { }
  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:3000/${token}`;
    const mailOptions = {
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to,
      subject: 'Password Reset',
      text: `To reset your password, please click on the following link: ${resetLink}`,
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
}
