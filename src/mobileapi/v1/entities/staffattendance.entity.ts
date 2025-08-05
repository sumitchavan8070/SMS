import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from './users.entity';
import { Schools } from './schools.entity';
import { Staff } from './staff.entity';


@Index("staff_id", ["staffId"], {})
@Index("staff_attendance_school_fk", ["schoolId"], {})
@Index("staff_attendance_staff_table_fk", ["staffTableId"], {})
@Entity("staff_attendance", { schema: "sms" })
export class StaffAttendance {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "staff_id", nullable: true })
  staffId: number | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["present", "absent", "late"],
  })
  status: "present" | "absent" | "late" | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @Column("int", { name: "staff_table_id", nullable: true })
  staffTableId: number | null;

  @ManyToOne(() => Users, (users) => users.staffAttendances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "staff_id", referencedColumnName: "id" }])
  staff: Users;

  @ManyToOne(() => Schools, (schools) => schools.staffAttendances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @ManyToOne(() => Staff, (staff) => staff.staffAttendances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "staff_table_id", referencedColumnName: "id" }])
  staffTable: Staff;
}
