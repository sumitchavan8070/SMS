import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { School } from "../../school/entities/school.entity" 
import { Staff } from "./staff.entity"

export enum DepartmentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("staff_departments")
export class StaffDepartment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  school_id: number

  @Column({ length: 100 })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ nullable: true })
  head_staff_id: number

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  budget: number

  @Column({
    type: "enum",
    enum: DepartmentStatus,
    default: DepartmentStatus.ACTIVE,
  })
  status: DepartmentStatus

  // Relations
  @ManyToOne(() => School)
  @JoinColumn({ name: "school_id" })
  school: School

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: "head_staff_id" })
  head: Staff
}
