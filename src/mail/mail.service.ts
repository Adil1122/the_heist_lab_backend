// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      //service: 'Gmail',
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        //user: process.env.MAIL_USER,
        //pass: process.env.MAIL_PASS,
        user: 'rex.murray@ethereal.email',
        pass: '6tDDA8KTWu1XPXBXaC'
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"No Reply" <rex.murray@ethereal.email>`,
      to,
      subject,
      html,
    });
  }
}
