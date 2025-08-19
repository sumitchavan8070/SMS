import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional } from "class-validator"

export class CreateLeaveApplicationDto {
  @IsNumber()
  @IsOptional()
  studentId?: number

  @IsNumber()
  @IsNotEmpty()
  leaveTypeId: number

  @IsDateString()
  @IsNotEmpty()
  startDate: string

  @IsDateString()
  @IsNotEmpty()
  endDate: string

  @IsString()
  @IsNotEmpty()
  reason: string

  @IsString()
  @IsOptional()
  medicalCertificate?: string
}
