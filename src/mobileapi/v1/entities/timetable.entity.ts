import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Classes } from './classes.entity';
import { Subjects } from './subjects.entity';
import { Schools } from './schools.entity';



@Index("class_id", ["classId"], {})
@Index("subject_id", ["subjectId"], {})
@Index("timetable_school_fk", ["schoolId"], {})
@Entity("timetable", { schema: "sms" })
export class Timetable {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "class_id", nullable: true })
  classId: number | null;

  @Column("int", { name: "subject_id", nullable: true })
  subjectId: number | null;

  @Column("enum", {
    name: "day",
    nullable: true,
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  })
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | null;

  @Column("time", { name: "start_time", nullable: true })
  startTime: string | null;

  @Column("time", { name: "end_time", nullable: true })
  endTime: string | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @ManyToOne(() => Classes, (classes) => classes.timetables, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "class_id", referencedColumnName: "id" }])
  class: Classes;

  @ManyToOne(() => Subjects, (subjects) => subjects.timetables, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "subject_id", referencedColumnName: "id" }])
  subject: Subjects;

  @ManyToOne(() => Schools, (schools) => schools.timetables, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
