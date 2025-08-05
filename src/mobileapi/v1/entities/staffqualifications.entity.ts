import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Staff } from "./staff.entity";

@Index("staff_id", ["staffId"], {})
@Entity("staff_qualifications", { schema: "sms" })
export class StaffQualifications {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "staff_id" })
  staffId: number;

  @Column("varchar", { name: "degree", length: 100 })
  degree: string;

  @Column("varchar", { name: "institution", length: 255 })
  institution: string;

  @Column("int", { name: "year_completed" })
  yearCompleted: number;

  @Column("decimal", {
    name: "percentage",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  // percentage: string | null;

  @Column("varchar", { name: "certificate_path", nullable: true, length: 500 })
  certificatePath: string | null;

  @ManyToOne(() => Staff, (staff) => staff.staffQualifications, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "staff_id", referencedColumnName: "id" }])
  staff: Staff;
}
