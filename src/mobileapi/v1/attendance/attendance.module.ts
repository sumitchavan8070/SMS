import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '../students/entities/user-profile.entity';
import { JwtMiddleware } from 'src/config/jwt.middleware';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([
      Attendance,
      Student,
      UserProfile,
      Class,
    ]),
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
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService], // Exported if used in other moduless
})
export class AttendanceModule {
  // Optional: configure middleware here if needed

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(AttendanceController);
    // .forRoutes('*');
  }
}

