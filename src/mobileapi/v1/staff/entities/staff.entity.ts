import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm"
import { School } from "../../school/entities/school.entity"
import { User } from "../../auth/entities/user.entity"
import { StaffQualification } from "./staff-qualification.entity"
import { StaffLeaveApplication } from "../../leave/entities/staff-leave-application.entity"
import { StaffPerformanceEvaluation } from "../../performance/entities/staff-performance-evaluation.entity" 
import { Salary } from "../../salary/entities/salary.entity" 
import { StaffAttendance } from "./staff-attendance.entity"

export enum StaffDepartment {
  ADMINISTRATION = "Administration",
  TEACHING = "Teaching",
  ACCOUNTS = "Accounts",
  IT = "IT",
  SUPPORT = "Support",
  SECURITY = "Security",
  MAINTENANCE = "Maintenance",
}

export enum StaffStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ON_LEAVE = "on_leave",
  TERMINATED = "terminated",
}

@Entity("staff")
export class Staff {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, unique: true })
  employee_id: string

  @Column()
  user_id: number

  @Column()
  school_id: number

  @Column({
    type: "enum",
    enum: StaffDepartment,
    default: StaffDepartment.TEACHING,
  })
  department: StaffDepartment

  @Column({ length: 100 })
  designation: string

  @Column({ type: "date" })
  joining_date: Date

  @Column({ length: 10, nullable: true })
  salary_grade: string

  @Column({ length: 255, nullable: true })
  qualification: string

  @Column({ default: 0 })
  experience_years: number

  @Column({
    type: "enum",
    enum: StaffStatus,
    default: StaffStatus.ACTIVE,
  })
  status: StaffStatus

  @Column({ nullable: true })
  reporting_manager_id: number

  @Column({ length: 20, nullable: true })
  emergency_contact: string

  @Column({ length: 5, nullable: true })
  blood_group: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  // Relations
  @ManyToOne(
    () => School,
    (school) => school.staff,
  )
  @JoinColumn({ name: "school_id" })
  school: School

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: "user_id" })
  user: User

  @ManyToOne(
    () => Staff,
    (staff) => staff.subordinates,
    { nullable: true },
  )
  @JoinColumn({ name: "reporting_manager_id" })
  reportingManager: Staff

  @OneToMany(
    () => Staff,
    (staff) => staff.reportingManager,
  )
  subordinates: Staff[]

  @OneToMany(
    () => StaffQualification,
    (qualification) => qualification.staff,
  )
  qualifications: StaffQualification[]

  @OneToMany(
    () => StaffLeaveApplication,
    (leave) => leave.staff,
  )
  leaveApplications: StaffLeaveApplication[]

  @OneToMany(
    () => StaffPerformanceEvaluation,
    (evaluation) => evaluation.staff,
  )
  performanceEvaluations: StaffPerformanceEvaluation[]

  @OneToMany(
    () => Salary,
    (salary) => salary.staff,
  )
  salaries: Salary[]

  @OneToMany(
    () => StaffAttendance,
    (attendance) => attendance.staff,
  )
  attendanceRecords: StaffAttendance[]
  
}

