// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Student } from './student.entity';

// @Entity('attendance')
// export class Attendance {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   status: string;

//   @Column()
//   date: Date;

//   @Column({ nullable: true })
//   remarks: string;

//   @ManyToOne(() => Student, student => student.attendance, { eager: false })
//   @JoinColumn({ name: 'student_id' })
//   student: Student;
//   student_id: any;  
// }
