import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Students } from "./students.entity";
import { Schools } from "./schools.entity"; 

@Index("student_id", ["studentId"], {})
@Index("attendance_school_fk", ["schoolId"], {})
@Entity("attendance", { schema: "sms" })
export class Attendance {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "student_id", nullable: true })
  studentId: number | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["present", "absent", "late"],
  })
  status: "present" | "absent" | "late" | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @ManyToOne(() => Students, (students) => students.attendances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Students;

  @ManyToOne(() => Schools, (schools) => schools.attendances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
