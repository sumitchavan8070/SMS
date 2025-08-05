import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users.entity";
import { Schools } from "./schools.entity";

@Index("posted_by", ["postedBy"], {})
@Index("announcements_school_fk", ["schoolId"], {})
@Entity("announcements", { schema: "sms" })
export class Announcements {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("text", { name: "message", nullable: true })
  message: string | null;

  @Column("enum", {
    name: "audience",
    nullable: true,
    enum: ["all", "students", "staff", "parents"],
  })
  audience: "all" | "students" | "staff" | "parents" | null;

  @Column("int", { name: "posted_by", nullable: true })
  postedBy: number | null;

  @Column("date", { name: "posted_on", nullable: true })
  postedOn: string | null;

  @Column("int", { name: "school_id", nullable: true })
  schoolId: number | null;

  @ManyToOne(() => Users, (users) => users.announcements, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "posted_by", referencedColumnName: "id" }])
  postedBy2: Users;

  @ManyToOne(() => Schools, (schools) => schools.announcements, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;
}
