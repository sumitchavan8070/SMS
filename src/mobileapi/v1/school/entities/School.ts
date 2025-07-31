// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
// import { User } from "../../user/entities/User"
// import { Staff } from "../../staff/entities/staff.entity" 
// import { Student } from "../../attendance/entities/student.entity"
// import { Class } from "../../class/entities/Class"

// export enum SchoolStatus {
//   ACTIVE = "active",
//   INACTIVE = "inactive",
// }

// @Entity("schools")
// export class School {
//   @PrimaryGeneratedColumn()
//   id: number

//   @Column({ length: 255 })
//   name: string

//   @Column({ length: 50, unique: true })
//   code: string

//   @Column({ type: "text", nullable: true })
//   address: string

//   @Column({ length: 20, nullable: true })
//   phone: string

//   @Column({ length: 255, nullable: true })
//   email: string

//   @Column({ length: 255, nullable: true })
//   principal_name: string

//   @Column({ nullable: true })
//   established_year: number

//   @Column({
//     type: "enum",
//     enum: SchoolStatus,
//     default: SchoolStatus.ACTIVE,
//   })
//   status: SchoolStatus

//   @CreateDateColumn()
//   created_at: Date

//   @UpdateDateColumn()
//   updated_at: Date

//   // Relations
//   @OneToMany(
//     () => User,
//     (user) => user.school,
//   )
//   users: User[]

//   @OneToMany(
//     () => Staff,
//     (staff) => staff.school,
//   )
//   staff: Staff[]

//   @OneToMany(
//     () => Student,
//     (student) => student.school,
//   )
//   students: Student[]

//   @OneToMany(
//     () => Class,
//     (classEntity) => classEntity.school,
//   )
//   classes: Class[]
// }
