import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExamResults } from './examresults.entity';
import { Classes } from './classes.entity';
import { Schools } from './schools.entity';


@Index("class_id", ["classId"], {})
@Index("exams_school_fk", ["schoolId"], {})
@Entity("exams", { schema: "sms" })
export class Exams {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "class_id", nullable: true })
  classId: number | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @OneToMany(() => ExamResults, (examResults) => examResults.exam)
  examResults: ExamResults[];

  @ManyToOne(() => Classes, (classes) => classes.exams, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "class_id", referencedColumnName: "id" }])
  class: Classes;

  @ManyToOne(() => Schools, (schools) => schools.exams, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
