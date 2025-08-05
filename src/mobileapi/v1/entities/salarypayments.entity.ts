import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Salaries } from "./salaries.entity";

@Index("salary_id", ["salaryId"], {})
@Entity("salary_payments", { schema: "sms" })
export class SalaryPayments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "salary_id", nullable: true })
  salaryId: number | null;

  @Column("date", { name: "payment_date", nullable: true })
  paymentDate: string | null;

  @Column("float", { name: "amount", nullable: true, precision: 12 })
  amount: number | null;

  @Column("enum", {
    name: "method",
    nullable: true,
    enum: ["cash", "bank_transfer"],
  })
  method: "cash" | "bank_transfer" | null;

  @ManyToOne(() => Salaries, (salaries) => salaries.salaryPayments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "salary_id", referencedColumnName: "id" }])
  salary: Salaries;
}
