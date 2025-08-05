import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../students/entities/user.entity';
import { UserProfile } from '../students/entities/user-profile.entity';
import { JwtMiddleware } from 'src/config/jwt.middleware';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Users } from '../entities/users.entity';
import { Parents } from '../entities/parents.entity';
import { Students } from '../entities/students.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User, UserProfile, Users, Parents, Students]),
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
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService], // Exported if used in other modules
})
export class StudentsModule {
  // Optional: configure middleware here if needed
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware).exclude(
    )
      .forRoutes(
        StudentsController

        // { path: 'v1/students/get-client-parents', method: RequestMethod.GET },
        // { path: 'v1/students/get-all-students', method: RequestMethod.GET },
        // { path: 'v1/students/get-student-by-id', method: RequestMethod.GET },
        // { path: 'v1/students/get-parents-by-student-id', method: RequestMethod.GET },



      );
    // .forRoutes('*');
  }
}
