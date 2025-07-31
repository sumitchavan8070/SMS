
import type { StaffDepartment, StaffStatus } from "../entities/staff.entity"

export interface CreateStaffDto {
  employee_id: string
  school_id: number
  department: StaffDepartment
  designation: string
  joining_date: Date
  salary_grade?: string
  qualification?: string
  experience_years: number
  reporting_manager_id?: number
  emergency_contact?: string
  blood_group?: string
  // User data
  username: string
  email: string
  password: string
  role_id: number
  // Profile data
  full_name: string
  gender?: string
  dob?: Date
  address?: string
  phone?: string
}

export interface UpdateStaffDto {
  department?: StaffDepartment
  designation?: string
  salary_grade?: string
  qualification?: string
  experience_years?: number
  status?: StaffStatus
  reporting_manager_id?: number
  emergency_contact?: string
  blood_group?: string
}

export interface StaffFilterDto {
  schoolId?: number
  department?: StaffDepartment
  status?: StaffStatus
  designation?: string
  withSummary?: boolean
}
