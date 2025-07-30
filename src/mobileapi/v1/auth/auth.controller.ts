// src/mobileapi/v1/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


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


  @HttpCode(HttpStatus.OK)
  @Get('get-client-profile')
  async getClientProfile(@Req() req: Request) {
    const user = req['user'];
    const userId = user.userId;

    return await this.authService.getClientProfile(userId);
  }



  @HttpCode(HttpStatus.OK)
  @Post('update-client-profile')
  async updateClientProfile(@Req() req: Request) {
    const user = req['user'];
    const reqBody = req.body;
    const userId = user.userId;
    const roleId = user.roleId;

    return await this.authService.updateClientProfile(userId, roleId, reqBody);
  }

  @HttpCode(HttpStatus.OK)
  @Get('get-roles')
  async getRoles(@Req() req: Request) {
    return await this.authService.getRoles();
  }


  @HttpCode(HttpStatus.OK)
  @Get('update-all-students-code')
  async updateAllStudentCodes(@Req() req: Request) {
    return await this.authService.updateAllStudentCodes();
  }
  


}
