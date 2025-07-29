import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Class } from './class.entity'; 
import { Attendance } from './attendance.entity';
import { UserProfile } from './user-profile.entity'; 

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  class_id: number;

  @Column()
  roll_number: string;

  @ManyToOne(() => Class, classEntity => classEntity.students)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => UserProfile, user => user.user_id)
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfile;

  @OneToMany(() => Attendance, attendance => attendance.student)
  attendance: Attendance[];
}
