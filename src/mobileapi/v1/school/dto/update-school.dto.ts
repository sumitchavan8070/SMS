import { IsOptional, IsString, IsNumber, IsEmail, IsEnum } from "class-validator"
import { SchoolStatus } from "../entities/school.entity"

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  principal_name?: string

  @IsOptional()
  @IsNumber()
  established_year?: number

  @IsOptional()
  @IsEnum(SchoolStatus)
  status?: SchoolStatus
}
