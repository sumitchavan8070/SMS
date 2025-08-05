import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Announcements } from './announcements.entity';
import { Classes } from './classes.entity';
import { Leaves } from './leaves.entity';
import { Parents } from './parents.entity';
import { Salaries } from './salaries.entity';
import { Staff } from './staff.entity';
import { StaffAttendance } from './staffattendance.entity';
import { Students } from './students.entity';
import { Subjects } from './subjects.entity';
import { UserProfiles } from './userprofiles.entity';
import { Roles } from './roles.entity';
import { Schools } from './schools.entity';

@Index("role_id", ["roleId"], {})
@Index("users_school_fk", ["schoolId"], {})
@Entity("users", { schema: "sms" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "username", nullable: true, length: 255 })
  username: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column()
  password: string;

  @Column("int", { name: "role_id", nullable: true })
  roleId: number | null;

  @Column({ name: 'school_id' })
  schoolId: number ;

  @OneToMany(() => Announcements, (announcements) => announcements.postedBy2)
  announcements: Announcements[];

  @OneToMany(() => Classes, (classes) => classes.classTeacher)
  classes: Classes[];

  @OneToMany(() => Leaves, (leaves) => leaves.user)
  leaves: Leaves[];

  @OneToMany(() => Parents, (parents) => parents.user)
  parents: Parents[];

  @OneToMany(() => Salaries, (salaries) => salaries.staff)
  salaries: Salaries[];

  @OneToMany(() => Staff, (staff) => staff.user)
  staff: Staff[];

  @OneToMany(() => StaffAttendance, (staffAttendance) => staffAttendance.staff)
  staffAttendances: StaffAttendance[];

  @OneToMany(() => Students, (students) => students.user)
  students: Students[];

  @OneToMany(() => Subjects, (subjects) => subjects.teacher)
  subjects: Subjects[];

  @OneToMany(() => UserProfiles, (userProfiles) => userProfiles.user)
  userProfiles: UserProfiles[];

  @ManyToOne(() => Roles, (roles) => roles.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Roles;

  @ManyToOne(() => Schools, (schools) => schools.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
