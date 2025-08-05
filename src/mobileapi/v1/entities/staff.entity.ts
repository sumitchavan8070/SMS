import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Salaries } from './salaries.entity';
import { Schools } from './schools.entity';
import { Users } from './users.entity';
import { StaffAttendance } from './staffattendance.entity';
import { StaffDepartments } from './staffdepartments.entity';
import { StaffLeaveApplications } from './staffleaveapplications.entity';
import { StaffPerformanceEvaluations } from './staffperformanceevaluations.entity';
import { StaffQualifications } from './staffqualifications.entity';
import { UserProfile } from "./userprofile.entity";
import { UserProfiles } from "./userprofiles.entity";


@Index("employee_id", ["employeeId"], { unique: true })
@Index("user_id", ["userId"], {})
@Index("school_id", ["schoolId"], {})
@Index("reporting_manager_id", ["reportingManagerId"], {})
@Entity("staff", { schema: "sms" })
export class Staff {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "employee_id", unique: true, length: 50 })
  employeeId: string;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column()
  schoolId: number;

  @Column("enum", {
    name: "department",
    nullable: true,
    enum: [
      "Administration",
      "Teaching",
      "Accounts",
      "IT",
      "Support",
      "Security",
      "Maintenance",
    ],
    default: () => "'Teaching'",
  })
  department:
    | "Administration"
    | "Teaching"
    | "Accounts"
    | "IT"
    | "Support"
    | "Security"
    | "Maintenance"
    | null;

  @Column("varchar", { name: "designation", length: 100 })
  designation: string;

  @Column("date", { name: "joining_date" })
  joiningDate: string;

  @Column("varchar", { name: "salary_grade", nullable: true, length: 10 })
  salaryGrade: string | null;

  @Column("varchar", { name: "qualification", nullable: true, length: 255 })
  qualification: string | null;

  @Column("int", {
    name: "experience_years",
    nullable: true,
    default: () => "'0'",
  })
  experienceYears: number | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["active", "inactive", "on_leave", "terminated"],
    default: () => "'active'",
  })
  status: "active" | "inactive" | "on_leave" | "terminated" | null;

  @Column("int", { name: "reporting_manager_id", nullable: true })
  reportingManagerId: number | null;

  @Column("varchar", { name: "emergency_contact", nullable: true, length: 20 })
  emergencyContact: string | null;

  @Column("varchar", { name: "blood_group", nullable: true, length: 5 })
  bloodGroup: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @OneToMany(() => Salaries, (salaries) => salaries.staffTable)
  salaries: Salaries[];

  @ManyToOne(() => Staff, (staff) => staff.staff, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "reporting_manager_id", referencedColumnName: "id" }])
  reportingManager: Staff;

  @OneToMany(() => Staff, (staff) => staff.reportingManager)
  staff: Staff[];

  @ManyToOne(() => Schools, (schools) => schools.staff, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @ManyToOne(() => Users, (users) => users.staff, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(
    () => StaffAttendance,
    (staffAttendance) => staffAttendance.staffTable
  )
  staffAttendances: StaffAttendance[];

  @OneToMany(
    () => StaffDepartments,
    (staffDepartments) => staffDepartments.headStaff
  )
  staffDepartments: StaffDepartments[];

  @OneToMany(
    () => StaffLeaveApplications,
    (staffLeaveApplications) => staffLeaveApplications.approvedBy2
  )
  staffLeaveApplications: StaffLeaveApplications[];

  @OneToMany(
    () => StaffLeaveApplications,
    (staffLeaveApplications) => staffLeaveApplications.staff
  )
  staffLeaveApplications2: StaffLeaveApplications[];

  @OneToMany(
    () => StaffPerformanceEvaluations,
    (staffPerformanceEvaluations) => staffPerformanceEvaluations.evaluator
  )
  staffPerformanceEvaluations: StaffPerformanceEvaluations[];

  @OneToMany(
    () => StaffPerformanceEvaluations,
    (staffPerformanceEvaluations) => staffPerformanceEvaluations.staff
  )
  staffPerformanceEvaluations2: StaffPerformanceEvaluations[];

  @OneToMany(
    () => StaffQualifications,
    (staffQualifications) => staffQualifications.staff
  )
  staffQualifications: StaffQualifications[];

  @OneToMany(() => UserProfiles, (profile) => profile.user)
userProfiles: UserProfiles[];

}
