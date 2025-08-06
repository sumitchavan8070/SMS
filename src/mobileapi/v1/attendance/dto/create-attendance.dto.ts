// src/attendance/dto/create-attendance.dto.ts
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  @IsNotEmpty()
  student_id: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(['present', 'absent', 'late'])
  status: 'present' | 'absent' | 'late';

  @IsString()
  @IsOptional()
  remarks?: string;
}
