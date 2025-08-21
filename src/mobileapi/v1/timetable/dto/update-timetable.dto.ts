import { IsNumber, IsString, IsOptional, IsBoolean } from "class-validator"

export class UpdateTimetableDto {
  @IsNumber()
  @IsOptional()
  classId?: number

  @IsNumber()
  @IsOptional()
  subjectId?: number

  @IsNumber()
  @IsOptional()
  teacherId?: number


  @IsString()
  @IsOptional()
  dayOfWeek?: string

  @IsString()
  @IsOptional()
  startTime?: string

  @IsString()
  @IsOptional()
  endTime?: string

  @IsString()
  @IsOptional()
  room?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
