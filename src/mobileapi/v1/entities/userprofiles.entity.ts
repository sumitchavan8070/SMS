import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users.entity";
import { Schools } from "./schools.entity";

@Index("user_id", ["userId"], {})
@Entity("user_profiles", { schema: "sms" })
export class UserProfiles {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("varchar", { name: "full_name", nullable: true, length: 255 })
  fullName: string | null;

  @Column("varchar", { name: "gender", nullable: true, length: 255 })
  gender: string | null;

  @Column("date", { name: "dob", nullable: true })
  dob: string | null;

  @Column("text", { name: "address", nullable: true })
  address: string | null;

  @Column("varchar", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @ManyToOne(() => Users, (user) => user.userProfiles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
