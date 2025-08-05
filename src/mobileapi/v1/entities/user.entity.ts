import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./userprofile.entity";

@Entity("user", { schema: "sms" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "username", length: 255 })
  username: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  userProfile: UserProfile;
}
