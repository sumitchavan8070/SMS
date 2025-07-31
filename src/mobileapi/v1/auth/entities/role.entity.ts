import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./user.entity"

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100, unique: true })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @OneToMany(
    () => User,
    (user) => user.role,
  )
  users: User[]
}
