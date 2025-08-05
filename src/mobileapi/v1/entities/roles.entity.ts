import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity("roles", { schema: "sms" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @OneToMany(() => Users, (users) => users.role)
  users: Users[];
}
