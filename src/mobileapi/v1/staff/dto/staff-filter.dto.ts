import { IsOptional, IsNumber, IsEnum, IsString } from "class-validator"
import { Transform } from "class-transformer"
import { StaffDepartment, StaffStatus } from "../entities/staff.entity"

export class StaffFilterDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  schoolId?: number

  @IsOptional()
  @IsEnum(StaffDepartment)
  department?: StaffDepartment

  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus

  @IsOptional()
  @IsString()
  designation?: string

  @IsOptional()
  @Transform(({ value }) => value === "true")
  withSummary?: boolean
}
