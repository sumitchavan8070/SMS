import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { School } from "../../school/entities/school.entity" 
import { Student } from "../../attendance/entities/student.entity" 
import { Subject } from "../../subject/entities/Subject"

@Entity("classes")
export class Class {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column()
  school_id: number

  // Relations
  // @ManyToOne(
  //   () => School,
  //   (school) => school.classes,
  // )
  @JoinColumn({ name: "school_id" })
  school: School

  @OneToMany(
    () => Student,
    (student) => student.class,
  )
  students: Student[]

  @OneToMany(
    () => Subject,
    (subject) => subject.class,
  )
  subjects: Subject[]
}
