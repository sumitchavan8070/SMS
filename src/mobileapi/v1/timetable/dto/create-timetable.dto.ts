import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator"

export class CreateTimetableDto {
  @IsNumber()
  @IsNotEmpty()
  classId: number

  @IsNumber()
  @IsNotEmpty()
  subjectId: number

  @IsNumber()
  @IsNotEmpty()
  teacherId: number

  @IsString()
  @IsNotEmpty()
  schoolId:number

  @IsString()
  @IsNotEmpty()
  startTime: string

  @IsString()
  @IsNotEmpty()
  endTime: string

  @IsString()
  @IsOptional()
  room?: string
}
