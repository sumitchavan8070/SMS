import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fees_structure')
export class FeesStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school_id: number;

  @Column()
  class_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  tuition_fee: number;

  @Column('decimal', { precision: 10, scale: 2 })
  annual_fee: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_fee: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  q1: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  q2: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  q3: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  q4: number;
}
