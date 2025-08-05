import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Students } from './students.entity';
import { Subjects } from './subjects.entity';
import { Exams } from './exams.entity';
import { Schools } from './schools.entity';

@Index("student_id", ["studentId"], {})
@Index("subject_id", ["subjectId"], {})
@Index("exam_id", ["examId"], {})
@Index("exam_results_school_fk", ["schoolId"], {})
@Entity("exam_results", { schema: "sms" })
export class ExamResults {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "student_id", nullable: true })
  studentId: number | null;

  @Column("int", { name: "subject_id", nullable: true })
  subjectId: number | null;

  @Column("int", { name: "exam_id", nullable: true })
  examId: number | null;

  @Column("float", { name: "marks_obtained", nullable: true, precision: 12 })
  marksObtained: number | null;

  @Column("varchar", { name: "grade", nullable: true, length: 255 })
  grade: string | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @ManyToOne(() => Students, (students) => students.examResults, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Students;

  @ManyToOne(() => Subjects, (subjects) => subjects.examResults, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "subject_id", referencedColumnName: "id" }])
  subject: Subjects;

  @ManyToOne(() => Exams, (exams) => exams.examResults, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "exam_id", referencedColumnName: "id" }])
  exam: Exams;

  @ManyToOne(() => Schools, (schools) => schools.examResults, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
