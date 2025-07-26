import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;
  role_id: any;
}
