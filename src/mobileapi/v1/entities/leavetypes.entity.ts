import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Schools } from './schools.entity';
import { StaffLeaveApplications } from './staffleaveapplications.entity';


@Index("school_id", ["schoolId"], {})
@Entity("leave_types", { schema: "sms" })
export class LeaveTypes {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "school_id" })
  schoolId: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "max_days_per_year", nullable: true })
  maxDaysPerYear: number | null;

  @Column("tinyint", {
    name: "carry_forward_allowed",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  carryForwardAllowed: boolean | null;

  @Column("tinyint", {
    name: "requires_medical_certificate",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  requiresMedicalCertificate: boolean | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["active", "inactive"],
    default: () => "'active'",
  })
  status: "active" | "inactive" | null;

  @ManyToOne(() => Schools, (schools) => schools.leaveTypes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @OneToMany(
    () => StaffLeaveApplications,
    (staffLeaveApplications) => staffLeaveApplications.leaveType
  )
  staffLeaveApplications: StaffLeaveApplications[];
}
