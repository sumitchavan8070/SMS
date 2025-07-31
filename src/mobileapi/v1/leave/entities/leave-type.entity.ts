import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { School } from "../../school/entities/school.entity"
import { StaffLeaveApplication } from "./staff-leave-application.entity"

export enum LeaveTypeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("leave_types")
export class LeaveType {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  school_id: number

  @Column({ length: 100 })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ nullable: true })
  max_days_per_year: number

  @Column({ default: false })
  carry_forward_allowed: boolean

  @Column({ default: false })
  requires_medical_certificate: boolean

  @Column({
    type: "enum",
    enum: LeaveTypeStatus,
    default: LeaveTypeStatus.ACTIVE,
  })
  status: LeaveTypeStatus

  @ManyToOne(() => School)
  @JoinColumn({ name: "school_id" })
  school: School

  @OneToMany(
    () => StaffLeaveApplication,
    (application) => application.leaveType,
  )
  applications: StaffLeaveApplication[]
}
