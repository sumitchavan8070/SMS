import { IsOptional, IsNumber, IsEnum } from "class-validator"
import { Transform } from "class-transformer"
import { LeaveApplicationStatus } from "../entities/staff-leave-application.entity"

export class LeaveFilterDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  schoolId?: number

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  staffId?: number

  @IsOptional()
  @IsEnum(LeaveApplicationStatus)
  status?: LeaveApplicationStatus

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  year?: number
}
