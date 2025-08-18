// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from './mobileapi/v1/v1.module';
import { jwtConfig } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AttendanceModule } from './mobileapi/v1/attendance/attendance.module';
import { StudentsModule } from './mobileapi/v1/students/students.module';
import { SuperadminModule } from './mobileapi/v1/superadmin/superadmin.module';
import { FeesStructureModule } from './mobileapi/v1/fees-structure/fees-structure.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: jwtConfig.signOptions,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'postgres'
      host: process.env.DB_HOST,
      port: + "3306",
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity.js'], // ✅ This must include Attendance entity

    }),

    V1Module,
    StudentsModule,
    AttendanceModule, 
    SuperadminModule,
        FeesStructureModule,

  ],
})
export class AppModule { }
