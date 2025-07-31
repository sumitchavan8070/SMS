import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

@Entity("user_profiles")
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user_id: number

  @Column({ length: 255 })
  full_name: string

  @Column({
    type: "enum",
    enum: Gender,
    nullable: true,
  })
  gender: Gender

  @Column({ type: "date", nullable: true })
  dob: Date

  @Column({ type: "text", nullable: true })
  address: string

  @Column({ length: 20, nullable: true })
  phone: string

  @OneToOne(
    () => User,
    (user) => user.profile,
  )
  @JoinColumn({ name: "user_id" })
  user: User
}
