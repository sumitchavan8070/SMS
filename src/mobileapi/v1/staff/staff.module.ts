import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { StaffController } from "./staff.controller"
import { StaffService } from "./staff.service"
import { Staff } from "./entities/staff.entity"
import { StaffDepartment } from "./entities/staff-department.entity"
import { StaffQualification } from "./entities/staff-qualification.entity"
import { User } from "../auth/entities/user.entity"
import { UserProfile } from "../auth/entities/user-profile.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Staff, StaffDepartment, StaffQualification, User, UserProfile])],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
