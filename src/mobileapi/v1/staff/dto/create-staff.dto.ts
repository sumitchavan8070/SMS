import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail, IsEnum, IsDateString } from "class-validator"
import { StaffDepartment } from "../entities/staff.entity"
import { Gender } from "../../auth/entities/user-profile.entity"

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  employee_id: string

  @IsNotEmpty()
  @IsNumber()
  school_id: number

  @IsNotEmpty()
  @IsEnum(StaffDepartment)
  department: StaffDepartment

  @IsNotEmpty()
  @IsString()
  designation: string

  @IsNotEmpty()
  @IsDateString()
  joining_date: Date

  @IsOptional()
  @IsString()
  salary_grade?: string

  @IsOptional()
  @IsString()
  qualification?: string

  @IsNotEmpty()
  @IsNumber()
  experience_years: number

  @IsOptional()
  @IsNumber()
  reporting_manager_id?: number

  @IsOptional()
  @IsString()
  emergency_contact?: string

  @IsOptional()
  @IsString()
  blood_group?: string

  // User data
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsNumber()
  role_id: number

  // Profile data
  @IsNotEmpty()
  @IsString()
  full_name: string

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

  @IsOptional()
  @IsDateString()
  dob?: Date

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  phone?: string
}
