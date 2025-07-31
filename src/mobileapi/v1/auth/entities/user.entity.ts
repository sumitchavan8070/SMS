import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { School } from "../../school/entities/school.entity"
import { Role } from "./role.entity"
import { UserProfile } from "./user-profile.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255, unique: true })
  username: string

  @Column({ length: 255, unique: true })
  email: string

  @Column({ length: 255 })
  password: string

  @Column()
  role_id: number

  @Column()
  school_id: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(
    () => School,
    (school) => school.users,
  )
  @JoinColumn({ name: "school_id" })
  school: School

  @ManyToOne(
    () => Role,
    (role) => role.users,
  )
  @JoinColumn({ name: "role_id" })
  role: Role

  @OneToOne(
    () => UserProfile,
    (profile) => profile.user,
    { cascade: true },
  )
  profile: UserProfile
}
