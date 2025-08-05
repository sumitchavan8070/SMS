import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Schools } from "./schools.entity";
import { PerformanceScores } from "./performancescores.entity";

@Index("school_id", ["schoolId"], {})
@Entity("performance_criteria", { schema: "sms" })
export class PerformanceCriteria {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "school_id" })
  schoolId: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "max_score", nullable: true, default: () => "'10'" })
  maxScore: number | null;

  @Column("decimal", {
    name: "weight_percentage",
    nullable: true,
    precision: 5,
    scale: 2,
    default: () => "'10.00'",
  })
  weightPercentage: string | null;

  @Column("text", { name: "applicable_departments", nullable: true })
  applicableDepartments: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["active", "inactive"],
    default: () => "'active'",
  })
  status: "active" | "inactive" | null;

  @ManyToOne(() => Schools, (schools) => schools.performanceCriteria, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @OneToMany(
    () => PerformanceScores,
    (performanceScores) => performanceScores.criteria
  )
  performanceScores: PerformanceScores[];
}
