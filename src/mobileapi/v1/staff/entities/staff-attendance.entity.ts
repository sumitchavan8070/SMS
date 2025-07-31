import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Staff } from "./staff.entity"

@Entity("staff_attendance")
export class StaffAttendance {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Staff, staff => staff.attendanceRecords)
  staff: Staff

  @Column({ type: "date" })
  date: Date

  @Column({ default: true })
  present: boolean
}
