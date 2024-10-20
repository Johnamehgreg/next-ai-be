import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'everett.ryan@ethereal.email',
        pass: 'qNfKmf5yrEKRdVxdtS',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${token}`;
    const mailOptions = {
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to,
      subject: 'Password Reset',
      text: `To reset your password, please click on the following link: ${resetLink}`,
    };
    this.transporter.sendMail(mailOptions);
  }
}
