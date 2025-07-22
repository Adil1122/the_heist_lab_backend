// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: AuthDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @Post('forgot-password') 
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  /*@Get('activate-user/:id')
  activate(@Param('id') id: string) {
    return this.authService.activateUser(id);
  }*/

  @Post('activate-user')
  activate(@Body('email') email: string, @Body('otp') otp:string, @Body('saved_otp') saved_otp:string, @Body('otp_time') otp_time: number) {
    return this.authService.activateUser(email, otp, saved_otp, otp_time);
  }  

  @Post('reset-password') 
  resetPassword(@Body('email') email: string, @Body('old_password') old_password, @Body('new_password') new_password, @Body('password_confirmation') password_confirmation) {
    return this.authService.resetPassword(email, old_password, new_password, password_confirmation);
  }

  @Post('send-forgot-otp')
  sendForgotOtp(@Body('email') email: string) {
    return this.authService.sendForgotOtpEmail(email);
  }

}
