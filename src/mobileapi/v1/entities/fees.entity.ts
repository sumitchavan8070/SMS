import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Students } from './students.entity';
import { Schools } from './schools.entity';
import { Payments } from './payments.entity';


@Index("student_id", ["studentId"], {})
@Index("fees_school_fk", ["schoolId"], {})
@Entity("fees", { schema: "sms" })
export class Fees {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "student_id", nullable: true })
  studentId: number | null;

  @Column("varchar", { name: "term", nullable: true, length: 255 })
  term: string | null;

  @Column("float", { name: "amount", nullable: true, precision: 12 })
  amount: number | null;

  @Column("date", { name: "due_date", nullable: true })
  dueDate: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["paid", "unpaid", "partial"],
  })
  status: "paid" | "unpaid" | "partial" | null;

  @Column("varchar", { name: "fee_type", nullable: true, length: 255 })
  feeType: string | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @ManyToOne(() => Students, (students) => students.fees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Students;

  @ManyToOne(() => Schools, (schools) => schools.fees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @OneToMany(() => Payments, (payments) => payments.fee)
  payments: Payments[];
}
