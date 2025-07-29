import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn()
  user_id: number;

  @Column()
  full_name: string;

  @Column()
  gender: string;

  @Column()
  dob: Date;

  @Column()
  address: string;

  @Column()
  phone: string;
}

