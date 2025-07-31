import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Staff } from "./staff.entity"

@Entity("staff_qualifications")
export class StaffQualification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  staff_id: number

  @Column({ length: 100 })
  degree: string

  @Column({ length: 255 })
  institution: string

  @Column()
  year_completed: number

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  percentage: number

  @Column({ length: 500, nullable: true })
  certificate_path: string

  @ManyToOne(
    () => Staff,
    (staff) => staff.qualifications,
  )
  @JoinColumn({ name: "staff_id" })
  staff: Staff
}
