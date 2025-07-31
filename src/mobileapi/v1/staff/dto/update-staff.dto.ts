import { IsOptional, IsString, IsNumber, IsEnum } from "class-validator"
import { StaffDepartment, StaffStatus } from "../entities/staff.entity"

export class UpdateStaffDto {
  @IsOptional()
  @IsEnum(StaffDepartment)
  department?: StaffDepartment

  @IsOptional()
  @IsString()
  designation?: string

  @IsOptional()
  @IsString()
  salary_grade?: string

  @IsOptional()
  @IsString()
  qualification?: string

  @IsOptional()
  @IsNumber()
  experience_years?: number

  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus

  @IsOptional()
  @IsNumber()
  reporting_manager_id?: number

  @IsOptional()
  @IsString()
  emergency_contact?: string

  @IsOptional()
  @IsString()
  blood_group?: string
}
