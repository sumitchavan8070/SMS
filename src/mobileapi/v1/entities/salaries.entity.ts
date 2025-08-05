import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users.entity";
import { Schools } from "./schools.entity";
import { Staff } from "./staff.entity";
import { SalaryPayments } from "./salarypayments.entity";

@Index("staff_id", ["staffId"], {})
@Index("salaries_school_fk", ["schoolId"], {})
@Index("salaries_staff_table_fk", ["staffTableId"], {})
@Entity("salaries", { schema: "sms" })
export class Salaries {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "staff_id", nullable: true })
  staffId: number | null;

  @Column("varchar", { name: "month", nullable: true, length: 255 })
  month: string | null;

  @Column("int", { name: "year", nullable: true })
  year: number | null;

  @Column("float", { name: "base_salary", nullable: true, precision: 12 })
  baseSalary: number | null;

  @Column("float", { name: "bonus", nullable: true, precision: 12 })
  bonus: number | null;

  @Column("float", { name: "deductions", nullable: true, precision: 12 })
  deductions: number | null;

  @Column("float", { name: "total_salary", nullable: true, precision: 12 })
  totalSalary: number | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @Column("int", { name: "staff_table_id", nullable: true })
  staffTableId: number | null;

  @ManyToOne(() => Users, (users) => users.salaries, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "staff_id", referencedColumnName: "id" }])
  staff: Users;

  @ManyToOne(() => Schools, (schools) => schools.salaries, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @ManyToOne(() => Staff, (staff) => staff.salaries, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "staff_table_id", referencedColumnName: "id" }])
  staffTable: Staff;

  @OneToMany(() => SalaryPayments, (salaryPayments) => salaryPayments.salary)
  salaryPayments: SalaryPayments[];
}
