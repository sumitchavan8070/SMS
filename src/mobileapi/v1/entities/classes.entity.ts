import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Schools } from './schools.entity';
import { Users } from './users.entity';
import { Exams } from './exams.entity';
import { Students } from './students.entity';
import { Subjects } from './subjects.entity';
import { Timetable } from './timetable.entity'

@Index("classes_school_fk", ["schoolId"], {})
@Index("class_teacher_fk", ["classTeacherId"], {})
@Entity("classes", { schema: "sms" })
export class Classes {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column()
  name: string ;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @Column("int", { name: "class_teacher_id", nullable: true })
  classTeacherId: number | null;

  @ManyToOne(() => Schools, (schools) => schools.classes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @ManyToOne(() => Users, (users) => users.classes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "class_teacher_id", referencedColumnName: "id" }])
  classTeacher: Users;

  @OneToMany(() => Exams, (exams) => exams.class)
  exams: Exams[];

  @OneToMany(() => Students, (students) => students.class)
  students: Students[];

  @OneToMany(() => Subjects, (subjects) => subjects.class)
  subjects: Subjects[];

  @OneToMany(() => Timetable, (timetable) => timetable.class)
  timetables: Timetable[];
}
