import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("user_profile", { schema: "sms" })
export class UserProfile {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "fullName", length: 255 })
  fullName: string;

  @Column("varchar", { name: "phone", length: 255 })
  phone: string;

  @Column("varchar", { name: "address", length: 255 })
  address: string;

  @OneToOne(() => User, (user) => user.userProfile, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: User;
}
