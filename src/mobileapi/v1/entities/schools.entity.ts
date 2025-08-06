import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Announcements } from './announcements.entity';
import { Attendance } from './attendance.entity';
import { Classes } from './classes.entity';
import { ExamResults } from './examresults.entity';
import { Exams } from './exams.entity';
import { Fees } from './fees.entity';
import { LeaveTypes } from './leavetypes.entity';
import { Leaves } from './leaves.entity';
import { Parents } from './parents.entity';
import { PerformanceCriteria } from './performancecriteria.entity';
import { Salaries } from './salaries.entity';
import { Staff } from './staff.entity';
import { StaffAttendance } from './staffattendance.entity';
import { StaffDepartments } from './staffdepartments.entity';
import { StaffLeaveApplications } from './staffleaveapplications.entity';
import { StaffPerformanceEvaluations } from './staffperformanceevaluations.entity';
import { Students } from './students.entity';
import { Subjects } from './subjects.entity';
import { Timetable } from './timetable.entity';
import { Users } from './users.entity';


@Index("code", ["code"], { unique: true })
@Entity("schools", { schema: "sms" })
export class Schools {
  [x: string]: any;
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "code", unique: true, length: 50 })
  code: string;

  @Column("text", { name: "address", nullable: true })
  address: string | null;

  @Column("varchar", { name: "phone", nullable: true, length: 20 })
  phone: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("varchar", { name: "principal_name", nullable: true, length: 255 })
  principalName: string | null;

  @Column("int", { name: "established_year", nullable: true })
  establishedYear: number | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["active", "inactive"],
    default: () => "'active'",
  })
  status: "active" | "inactive" | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(() => Announcements, (announcements) => announcements.school)
  announcements: Announcements[];

  @OneToMany(() => Attendance, (attendance) => attendance.school)
  attendances: Attendance[];

  @OneToMany(() => Classes, (classes) => classes.school)
  classes: Classes[];

  @OneToMany(() => ExamResults, (examResults) => examResults.school)
  examResults: ExamResults[];

  @OneToMany(() => Exams, (exams) => exams.school)
  exams: Exams[];

  @OneToMany(() => Fees, (fees) => fees.school)
  fees: Fees[];

  @OneToMany(() => LeaveTypes, (leaveTypes) => leaveTypes.school)
  leaveTypes: LeaveTypes[];

  @OneToMany(() => Leaves, (leaves) => leaves.school)
  leaves: Leaves[];

  @OneToMany(() => Parents, (parents) => parents.school)
  parents: Parents[];

  @OneToMany(
    () => PerformanceCriteria,
    (performanceCriteria) => performanceCriteria.school
  )
  performanceCriteria: PerformanceCriteria[];

  @OneToMany(() => Salaries, (salaries) => salaries.school)
  salaries: Salaries[];

  @OneToMany(() => Staff, (staff) => staff.school)
  staff: Staff[];

  @OneToMany(() => StaffAttendance, (staffAttendance) => staffAttendance.school)
  staffAttendances: StaffAttendance[];

  @OneToMany(
    () => StaffDepartments,
    (staffDepartments) => staffDepartments.school
  )
  staffDepartments: StaffDepartments[];

  @OneToMany(
    () => StaffLeaveApplications,
    (staffLeaveApplications) => staffLeaveApplications.school
  )
  staffLeaveApplications: StaffLeaveApplications[];

  @OneToMany(
    () => StaffPerformanceEvaluations,
    (staffPerformanceEvaluations) => staffPerformanceEvaluations.school
  )
  staffPerformanceEvaluations: StaffPerformanceEvaluations[];

  @OneToMany(() => Students, (students) => students.school)
  students: Students[];

  @OneToMany(() => Subjects, (subjects) => subjects.school)
  subjects: Subjects[];

  @OneToMany(() => Timetable, (timetable) => timetable.school)
  timetables: Timetable[];

  @OneToMany(() => Users, (users) => users.school)
  users: Users[];
}
