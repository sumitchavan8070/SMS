import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from "class-validator"

export class CreateLeaveApplicationDto {
  @IsNotEmpty()
  @IsNumber()
  staff_id: number

  @IsNotEmpty()
  @IsNumber()
  leave_type_id: number

  @IsNotEmpty()
  @IsDateString()
  start_date: Date

  @IsNotEmpty()
  @IsDateString()
  end_date: Date

  @IsNotEmpty()
  @IsNumber()
  total_days: number

  @IsNotEmpty()
  @IsString()
  reason: string

  @IsOptional()
  @IsString()
  medical_certificate_path?: string

  @IsOptional()
  @IsString()
  emergency_contact_during_leave?: string

  @IsNotEmpty()
  @IsNumber()
  school_id: number
}
