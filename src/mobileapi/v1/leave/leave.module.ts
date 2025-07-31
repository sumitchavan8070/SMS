import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LeaveController } from "./leave.controller"
import { LeaveService } from "./leave.service"
import { LeaveType } from "./entities/leave-type.entity"
import { StaffLeaveApplication } from "./entities/staff-leave-application.entity"

@Module({
  imports: [TypeOrmModule.forFeature([LeaveType, StaffLeaveApplication])],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
