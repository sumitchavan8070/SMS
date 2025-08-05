import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Attendance } from './attendance.entity';
import { ExamResults } from './examresults.entity';
import { Fees } from './fees.entity';
import { Parents } from './parents.entity';
import { Users } from './users.entity';
import { Classes } from './classes.entity';
import { Schools } from './schools.entity';


@Index("user_id", ["userId"], {})
@Index("class_id", ["classId"], {})
@Index("students_school_fk", ["schoolId"], {})
@Entity("students", { schema: "sms" })
export class Students {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("int", { name: "class_id", nullable: true })
  classId: number | null;

  @Column("date", { name: "admission_date", nullable: true })
  admissionDate: string | null;

  @Column("int", { name: "roll_number", nullable: true })
  rollNumber: number | null;

  @Column("varchar", { name: "guardian_name", nullable: true, length: 255 })
  guardianName: string | null;

  @Column("text", { name: "address", nullable: true })
  address: string | null;

  @Column("varchar", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @Column("varchar", { name: "student_code", length: 50 })
  studentCode: string;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @OneToMany(() => ExamResults, (examResults) => examResults.student)
  examResults: ExamResults[];

  @OneToMany(() => Fees, (fees) => fees.student)
  fees: Fees[];

  @OneToMany(() => Parents, (parents) => parents.student)
  parents: Parents[];

  @ManyToOne(() => Users, (users) => users.students, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Classes, (classes) => classes.students, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "class_id", referencedColumnName: "id" }])
  class: Classes;

  @ManyToOne(() => Schools, (schools) => schools.students, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
