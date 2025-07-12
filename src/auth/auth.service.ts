// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private mailService: MailService,
    private configService: ConfigService
  ) {}

  getBaseUrl(): any {
    return this.configService.get<string>('BASE_URL');
  }

  async register(data: AuthDto) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      //throw new Error('Email already in use');
      return { message: 'Email already in use', status_code: 500 };
    }

    if(data.password !== data.password_confirmation) {
      return { message: 'Password Confirmation mismatched', status_code: 500 };
    }



    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create(data.name, data.email, hash);

    // activate user email
    var otp = Math.floor(Math.random() * 90000) + 10000;
    const html = 'Your One Time Password (OTP) for Email Activation is <b>' + otp + '</b>';
    this.mailService.sendEmail(user.email, 'Email Activation OTP', html);
    const registered_user_details = {_id: user._id, email: user.email, otp: otp}

    return { message: 'User registered', registered_user_details: registered_user_details, status_code: 200 };
  }

  async login(data: AuthDto) { 
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      return { message: 'Invalid credentials', status_code: 500 };
      //throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return { message: 'Invalid credentials', status_code: 500 };
      //throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
    return { message: 'Login successful', token, status_code: 200 };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'Email not found', status_code: 500 }
      //throw new Error('Email not found');
    }

    const token = jwt.sign({ id: user.email }, 'your_jwt_secret', { expiresIn: '15m' });
    // You can send this token via email using nodemailer
    return { message: 'Reset link generated (simulated)', token, status_code: 200 };
  }

  async activateUser(id: string, otp:string, saved_otp:string, otp_time: number) {

    const current_time = Date.now();
    const five_minutes = 5 * 60 * 1000;

    if(otp === saved_otp) {

      if(current_time - otp_time > five_minutes) {
        return { message: 'OTP Expired', status_code: 500 }
      }
      
      const user = await this.usersService.activate(id);
      if(user) {
        return { message: 'User is activated', user: user, status_code: 200 }
      } else {
        return { message: 'User not found', status_code: 500 }
      }
    } else {
      return { message: 'OTP Mismatched', status_code: 500 }
    }
  }

  async resetPassword(email: string, old_password: string, new_password: string, password_confirmation: string) {
    const resetResponse = await this.usersService.resetPassword(email, old_password, new_password, password_confirmation);
    return { message: resetResponse.message, user: resetResponse.user, status_code: resetResponse.status_code }
  }
}
