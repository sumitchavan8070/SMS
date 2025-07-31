import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./User"

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100, unique: true })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  // Relations
  @OneToMany(
    () => User,
    (user) => user.role,
  )
  users: User[]
}
