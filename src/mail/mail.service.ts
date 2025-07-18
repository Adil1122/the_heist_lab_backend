// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      //host: 'smtp.ethereal.email',
      //port: 587,
      auth: {
        user: 'sheikh.muhammad.hanif.99@gmail.com',
        pass: 'uofzwigbesydchwx',
        //user: 'fleta.stracke15@ethereal.email',
        //pass: 'DPSgHa7bE5DzqV4UhM'
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
