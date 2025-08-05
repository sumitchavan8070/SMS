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
import { LeaveTypes } from './leavetypes.entity';


@Index("staff_id", ["staffId"], {})
@Index("leave_type_id", ["leaveTypeId"], {})
@Index("approved_by", ["approvedBy"], {})
@Index("school_id", ["schoolId"], {})
@Entity("staff_leave_applications", { schema: "sms" })
export class StaffLeaveApplications {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "staff_id" })
  staffId: number;

  @Column("int", { name: "leave_type_id" })
  leaveTypeId: number;

  @Column("date", { name: "start_date" })
  startDate: string;

  @Column("date", { name: "end_date" })
  endDate: string;

  @Column("int", { name: "total_days" })
  totalDays: number;

  @Column("text", { name: "reason" })
  reason: string;

  @Column("varchar", {
    name: "medical_certificate_path",
    nullable: true,
    length: 500,
  })
  medicalCertificatePath: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: () => "'pending'",
  })
  status: "pending" | "approved" | "rejected" | "cancelled" | null;

  @Column("timestamp", {
    name: "applied_on",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  appliedOn: Date | null;

  @Column("int", { name: "approved_by", nullable: true })
  approvedBy: number | null;

  @Column("timestamp", { name: "approved_on", nullable: true })
  approvedOn: Date | null;

  @Column("text", { name: "rejection_reason", nullable: true })
  rejectionReason: string | null;

  @Column("varchar", {
    name: "emergency_contact_during_leave",
    nullable: true,
    length: 20,
  })
  emergencyContactDuringLeave: string | null;

  @Column("int", { name: "school_id" })
  schoolId: number;

  @ManyToOne(() => Staff, (staff) => staff.staffLeaveApplications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "approved_by", referencedColumnName: "id" }])
  approvedBy2: Staff;

  @ManyToOne(() => Schools, (schools) => schools.staffLeaveApplications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @ManyToOne(() => Staff, (staff) => staff.staffLeaveApplications2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "staff_id", referencedColumnName: "id" }])
  staff: Staff;

  @ManyToOne(
    () => LeaveTypes,
    (leaveTypes) => leaveTypes.staffLeaveApplications,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "leave_type_id", referencedColumnName: "id" }])
  leaveType: LeaveTypes;
}
