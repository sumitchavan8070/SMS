import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Staff } from "../../staff/entities/staff.entity"
import { School } from "../../school/entities/school.entity"

@Entity("salaries")
export class Salary {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  staff_id: number

  @Column()
  staff_table_id: number

  @Column({ length: 20 })
  month: string

  @Column()
  year: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  base_salary: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  bonus: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  deductions: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_salary: number

  @Column()
  school_id: number

  @ManyToOne(
    () => Staff,
    (staff) => staff.salaries,
  )
  @JoinColumn({ name: "staff_table_id" })
  staff: Staff

  @ManyToOne(() => School)
  @JoinColumn({ name: "school_id" })
  school: School
}
