import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Staff } from "../../staff/entities/staff.entity"
import { LeaveType } from "./leave-type.entity"
import { School } from "../../school/entities/school.entity"

export enum LeaveApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

@Entity("staff_leave_applications")
export class StaffLeaveApplication {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  staff_id: number

  @Column()
  leave_type_id: number

  @Column({ type: "date" })
  start_date: Date

  @Column({ type: "date" })
  end_date: Date

  @Column()
  total_days: number

  @Column({ type: "text" })
  reason: string

  @Column({ length: 500, nullable: true })
  medical_certificate_path: string

  @Column({
    type: "enum",
    enum: LeaveApplicationStatus,
    default: LeaveApplicationStatus.PENDING,
  })
  status: LeaveApplicationStatus

  @CreateDateColumn()
  applied_on: Date

  @Column({ nullable: true })
  approved_by: number

  @Column({ type: "timestamp", nullable: true })
  approved_on: Date

  @Column({ type: "text", nullable: true })
  rejection_reason: string

  @Column({ length: 20, nullable: true })
  emergency_contact_during_leave: string

  @Column()
  school_id: number

  @ManyToOne(
    () => Staff,
    (staff) => staff.leaveApplications,
  )
  @JoinColumn({ name: "staff_id" })
  staff: Staff

  @ManyToOne(
    () => LeaveType,
    (leaveType) => leaveType.applications,
  )
  @JoinColumn({ name: "leave_type_id" })
  leaveType: LeaveType

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: "approved_by" })
  approver: Staff

  @ManyToOne(() => School)
  @JoinColumn({ name: "school_id" })
  school: School
}
