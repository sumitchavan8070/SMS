import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsString } from "class-validator"
import { LeaveApplicationStatus } from "../entities/staff-leave-application.entity"

export class UpdateLeaveStatusDto {
  @IsNotEmpty()
  @IsEnum(LeaveApplicationStatus)
  status: LeaveApplicationStatus

  @IsOptional()
  @IsNumber()
  approved_by?: number

  @IsOptional()
  @IsString()
  rejection_reason?: string
}
