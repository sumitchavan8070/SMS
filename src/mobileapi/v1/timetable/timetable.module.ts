import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TimetableController } from "./timetable.controller"
import { TimetableService } from "./timetable.service"
import { Timetable } from "../entities/timetable.entity" 
import { Classes } from "../entities/classes.entity"
// import { Subject } from 
import { Users } from "../entities/users.entity" 
import { Subjects } from "../entities/subjects.entity"


@Module({
  imports: [TypeOrmModule.forFeature([Timetable, Classes, Users, Subjects])],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})

export class TimetableModule {}
