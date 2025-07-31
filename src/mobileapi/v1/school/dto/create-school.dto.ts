import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEmail } from "class-validator"

export class CreateSchoolDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  code: string

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
}
