import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Department {
  Administration = 'Administration',
  Teaching = 'Teaching',
  Accounts = 'Accounts',
  IT = 'IT',
  Support = 'Support',
  Security = 'Security',
  Maintenance = 'Maintenance',
}

enum Status {
  active = 'active',
  inactive = 'inactive',
  on_leave = 'on_leave',
  terminated = 'terminated',
}

export class QualificationDto {
  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsInt()
  year_completed: number;

  @IsOptional()
  @IsInt()
  percentage?: number;

  @IsOptional()
  @IsString()
  certificate_path?: string;
}

export class CreateStaffDto {
  @IsInt()
  user_id: number;

  @IsInt()
  school_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  employee_id: string;

  @IsEnum(Department)
  department: Department;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsDateString({}, { message: 'joining_date must be a valid date string' })
  joining_date: string;

  @IsOptional()
  @IsString()
  salary_grade?: string;

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experience_years?: number;

  @IsOptional()
  @IsInt()
  reporting_manager_id?: number;

  @IsOptional()
  @IsString()
  emergency_contact?: string;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QualificationDto)
  qualifications: QualificationDto[];
}
// sumi