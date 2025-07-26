// src/mobileapi/v1/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../students/entities/user-profile.entity';
import { User } from '../students/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserProfile) private profileRepo: Repository<UserProfile>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const profile = await this.profileRepo.findOne({
      where: { user: { id: user.id } },
    });

    const payload = {
      userId: user.id,
      roleId: user.role_id,
      email: user.email,
      username: user.username,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: profile?.fullName,
        role_id: user.role_id,
      },
    };
  }
}
