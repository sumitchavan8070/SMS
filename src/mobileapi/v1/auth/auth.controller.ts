// src/mobileapi/v1/auth/auth.controller.ts
import { Controller, Post, Body , HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @HttpCode(HttpStatus.OK)
  @Post('client-login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('client-register')
  async register(@Body() body) {
    return await this.authService.register(body);
  }

}
