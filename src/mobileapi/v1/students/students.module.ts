// import { Module } from '@nestjs/common';
// import { StudentsController } from './students.controller';
// import { StudentsService } from './students.service';

// @Module({
//   controllers: [StudentsController],
//   providers: [StudentsService]
// })
// export class StudentsModule {}


import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../students/entities/user.entity';
import { UserProfile } from '../students/entities/user-profile.entity';
import { JwtMiddleware } from 'src/config/jwt.middleware';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User, UserProfile]),
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
        
        { path: 'v1/students/get-client-parents', method: RequestMethod.GET }, 

      );
    // .forRoutes('*');
  }
}
