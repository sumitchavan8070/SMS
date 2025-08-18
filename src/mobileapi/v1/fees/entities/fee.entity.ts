// entities/fee.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fees')
export class Fee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school_id: number;

  @Column()
  student_id: number;

  @Column()
  fee_type: string;

  @Column('decimal')
  amount: number;

  @Column()
  due_date: string;

  @Column()
  status: string;

  @Column()
  term: string;
}
