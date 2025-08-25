import { MiddlewareConsumer, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TimetableController } from "./timetable.controller"
import { TimetableService } from "./timetable.service"
import { Timetable } from "../entities/timetable.entity" 
import { Classes } from "../entities/classes.entity"
// import { Subject } from 
import { Users } from "../entities/users.entity" 
import { Subjects } from "../entities/subjects.entity"
import { JwtMiddleware } from "src/config/jwt.middleware"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"


@Module({
  imports: [TypeOrmModule.forFeature([Timetable, Classes, Users, Subjects], 
    
  ), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: process.env.JWT_SECRET || 'defaultSecret',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
      }),
    }),],
  
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})

export class TimetableModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(JwtMiddleware) 
        .forRoutes(TimetableController);
      }
  
}
