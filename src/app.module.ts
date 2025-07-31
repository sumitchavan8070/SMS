// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from './mobileapi/v1/v1.module';
import { jwtConfig } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AttendanceModule } from './mobileapi/v1/attendance/attendance.module';
import { StudentsModule } from './mobileapi/v1/students/students.module';
import { StaffModule } from './mobileapi/v1/staff/staff.module';
import { LeaveModule } from './mobileapi/v1/leave/leave.module';
import { PerformanceModule } from './mobileapi/v1/performance/performance.module';
import { SalaryModule } from './mobileapi/v1/salary/salary.module';
import { SchoolModule } from './mobileapi/v1/school/school.module';

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
      entities: [__dirname + '/../**/*.entity{.ts,.js}'], // ✅ THIS IS CRUCIAL

      synchronize: true,
      autoLoadEntities: true, // ✅ OR add the entities array manually

    }),

    V1Module,
    StudentsModule,
    AttendanceModule,

    StaffModule,
    LeaveModule,
    PerformanceModule,
    AttendanceModule,
    SalaryModule,
    StudentsModule,
    SchoolModule,
  ],
})
export class AppModule { }
