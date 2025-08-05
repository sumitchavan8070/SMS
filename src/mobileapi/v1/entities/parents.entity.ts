import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from './users.entity';
import { Students } from './students.entity';
import { Schools } from './schools.entity';

@Index("user_id", ["userId"], {})
@Index("student_id", ["studentId"], {})
@Index("parents_school_fk", ["schoolId"], {})
@Entity("parents", { schema: "sms" })
export class Parents {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("int", { name: "student_id", nullable: true })
  studentId: number | null;

  @Column("varchar", { name: "username", nullable: true, length: 100 })
  username: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  password: string | null;

  @Column("int", { name: "role_id", nullable: true })
  roleId: number | null;

  @Column("varchar", { name: "full_name", nullable: true, length: 255 })
  fullName: string | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @Column("varchar", { name: "parent_code", nullable: true, length: 255 })
parentCode: string | null;

  @ManyToOne(() => Users, (users) => users.parents, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Students, (students) => students.parents, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Students;

  @ManyToOne(() => Schools, (schools) => schools.parents, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
