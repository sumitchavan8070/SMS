import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Class } from "../../class/entities/Class" 
import { User } from "../../user/entities/User"
import { School } from "../../school/entities/school.entity" 

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column()
  class_id: number

  @Column()
  teacher_id: number

  @Column()
  school_id: number

  // Relations
  @ManyToOne(
    () => Class,
    (classEntity) => classEntity.subjects,
  )
  @JoinColumn({ name: "class_id" })
  class: Class

  @ManyToOne(() => User)
  @JoinColumn({ name: "teacher_id" })
  teacher: User

  @ManyToOne(() => School)
  @JoinColumn({ name: "school_id" })
  school: School
}
