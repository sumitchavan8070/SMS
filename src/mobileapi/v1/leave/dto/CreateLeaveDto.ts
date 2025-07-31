import type { LeaveApplicationStatus } from "../entities/StaffLeaveApplication"

export interface CreateLeaveApplicationDto {
  staff_id: number
  leave_type_id: number
  start_date: Date
  end_date: Date
  total_days: number
  reason: string
  medical_certificate_path?: string
  emergency_contact_during_leave?: string
  school_id: number
}

export interface UpdateLeaveStatusDto {
  status: LeaveApplicationStatus
  approved_by?: number
  rejection_reason?: string
}

export interface LeaveFilterDto {
  schoolId?: number
  staffId?: number
  status?: LeaveApplicationStatus
  year?: number
}
