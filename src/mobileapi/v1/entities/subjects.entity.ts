import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExamResults } from './examresults.entity';
import { Classes } from './classes.entity';
import { Users } from './users.entity';
import { Schools } from './schools.entity';
import { Timetable } from './timetable.entity';
import { UserProfiles } from "./userprofiles.entity";


@Index("class_id", ["classId"], {})
@Index("teacher_id", ["teacherId"], {})
@Index("subjects_school_fk", ["schoolId"], {})
@Entity("subjects", { schema: "sms" })
export class Subjects {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "class_id", nullable: true })
  classId: number | null;

  @Column("int", { name: "teacher_id", nullable: true })
  teacherId: number | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @OneToMany(() => ExamResults, (examResults) => examResults.subject)
  examResults: ExamResults[];

  @ManyToOne(() => Classes, (classes) => classes.subjects, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "class_id", referencedColumnName: "id" }])
  class: Classes;

  @ManyToOne(() => Users, (users) => users.subjects, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "teacher_id", referencedColumnName: "id" }])
  teacher: Users;

  @ManyToOne(() => Schools, (schools) => schools.subjects, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @OneToMany(() => Timetable, (timetable) => timetable.subject)
  timetables: Timetable[];

  @OneToOne(() => UserProfiles, (profile) => profile.user)
  profile: UserProfiles;
}
