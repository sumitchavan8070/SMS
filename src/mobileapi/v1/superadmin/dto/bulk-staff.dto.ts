import { IsNotEmpty, IsInt, IsString, IsEnum, IsNumber } from 'class-validator';

// Define the enum for departments to match your database schema
export enum StaffDepartment {
  Administration = 'Administration',
  Teaching = 'Teaching',
  Accounts = 'Accounts',
  IT = 'IT',
  Support = 'Support',
  Security = 'Security',
  Maintenance = 'Maintenance',
}

export class BulkStaffDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsString()
  dateOfBirth: string;

  @IsString()
  qualification: string;

  @IsInt()
  experienceYears: number;

  @IsNotEmpty()
  @IsString()
  dateOfAppointment: string;

  @IsString()
  revisedScaleOfPay: string;

  @IsInt()
  totalSalary: number;
}

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  employee_id: string;

//   @IsInt()
//   user_id: number;

  @IsInt()
  school_id: number;

  @IsEnum(StaffDepartment)
  department: StaffDepartment;

  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsNotEmpty()
  @IsString()
  joining_date: string;

  @IsString()
  salary_grade: string;

  @IsString()
  qualification: string;

  @IsInt()
  experience_years: number;

  @IsString()
  status: 'active';

  @IsInt()
  reporting_manager_id: number | null;

  @IsString()
  emergency_contact: string | null;

  @IsString()
  blood_group: string | null;
}