import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Staff } from './staff.entity';
import { Schools } from './schools.entity';


@Index("school_id", ["schoolId"], {})
@Index("head_staff_id", ["headStaffId"], {})
@Entity("staff_departments", { schema: "sms" })
export class StaffDepartments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "school_id" })
  schoolId: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "head_staff_id", nullable: true })
  headStaffId: number | null;

  @Column("decimal", {
    name: "budget",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  budget: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["active", "inactive"],
    default: () => "'active'",
  })
  status: "active" | "inactive" | null;

  @ManyToOne(() => Staff, (staff) => staff.staffDepartments, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "head_staff_id", referencedColumnName: "id" }])
  headStaff: Staff;

  @ManyToOne(() => Schools, (schools) => schools.staffDepartments, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
