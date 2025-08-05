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


@Index("user_id", ["userId"], {})
@Index("leaves_school_fk", ["schoolId"], {})
@Entity("leaves", { schema: "sms" })
export class Leaves {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("date", { name: "start_date", nullable: true })
  startDate: string | null;

  @Column("date", { name: "end_date", nullable: true })
  endDate: string | null;

  @Column("text", { name: "reason", nullable: true })
  reason: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["pending", "approved", "rejected"],
  })
  status: "pending" | "approved" | "rejected" | null;

  @Column("enum", {
    name: "type",
    nullable: true,
    enum: ["sick", "casual", "earned"],
  })
  type: "sick" | "casual" | "earned" | null;

  @Column("date", { name: "applied_on", nullable: true })
  appliedOn: string | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @ManyToOne(() => Users, (users) => users.leaves, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Schools, (schools) => schools.leaves, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
