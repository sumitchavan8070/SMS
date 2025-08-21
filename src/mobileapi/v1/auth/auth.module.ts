// src/mobileapi/v1/auth/auth.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { JwtMiddleware } from './jwt.strategy';

import { User } from '../students/entities/user.entity';
import { UserProfile } from '../students/entities/user-profile.entity';
import { JwtMiddleware } from 'src/config/jwt.middleware';
import { Users } from '../entities/users.entity';
import { UserProfiles } from '../entities/userprofiles.entity';
import { Students } from '../entities/students.entity';
import { Parents } from '../entities/parents.entity';
import { Classes } from '../entities/classes.entity';
import { Staff } from '../entities/staff.entity';
import { Roles } from '../entities/roles.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Users, User, UserProfile, UserProfiles, Students, Parents, Classes, Staff, Roles]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        
        secret: process.env.JWT_SECRET || 'defaultSecret',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Exported if used in other modules
})
export class AuthModule {
  // Optional: configure middleware here if needed
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware).exclude(
        { path: 'mobileapi/v1/auth/client-login', method: RequestMethod.POST },
        { path: 'mobileapi/v1/auth/client-register', method: RequestMethod.POST },
      )
      .forRoutes(
        { path: 'v1/auth/update-client-profile', method: RequestMethod.POST }, 
        { path: 'v1/auth/get-client-profile', method: RequestMethod.GET }, 
        { path: 'v1/auth/update-all-students-code', method: RequestMethod.GET }, 

      );    
    // .forRoutes('*');
  }
}
