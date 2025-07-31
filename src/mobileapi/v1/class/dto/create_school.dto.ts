import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsInt,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty({ message: 'School name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'School code is required' })
  @MaxLength(10, { message: 'Code must be less than 10 characters' })
  code: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Matches(/^\+?[0-9\s\-]{10,20}$/, {
    message: 'Phone number must be valid',
  })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  principal_name?: string;

  @IsOptional()
  @IsInt({ message: 'Established year must be a number' })
  @Min(1800, { message: 'Established year too old' })
  established_year?: number;

  @IsOptional()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either active or inactive',
  })
  status?: 'active' | 'inactive';
}




