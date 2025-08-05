import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PerformanceScores } from './performancescores.entity';
import { Staff } from './staff.entity';
import { Schools } from './schools.entity';


@Index("staff_id", ["staffId"], {})
@Index("evaluator_id", ["evaluatorId"], {})
@Index("school_id", ["schoolId"], {})
@Entity("staff_performance_evaluations", { schema: "sms" })
export class StaffPerformanceEvaluations {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "staff_id" })
  staffId: number;

  @Column("date", { name: "evaluation_period_start" })
  evaluationPeriodStart: string;

  @Column("date", { name: "evaluation_period_end" })
  evaluationPeriodEnd: string;

  @Column("int", { name: "evaluator_id" })
  evaluatorId: number;

  @Column("decimal", {
    name: "overall_score",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  overallScore: string | null;

  @Column("varchar", { name: "overall_grade", nullable: true, length: 5 })
  overallGrade: string | null;

  @Column("text", { name: "strengths", nullable: true })
  strengths: string | null;

  @Column("text", { name: "areas_for_improvement", nullable: true })
  areasForImprovement: string | null;

  @Column("text", { name: "goals_for_next_period", nullable: true })
  goalsForNextPeriod: string | null;

  @Column("text", { name: "evaluator_comments", nullable: true })
  evaluatorComments: string | null;

  @Column("text", { name: "staff_comments", nullable: true })
  staffComments: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["draft", "submitted", "reviewed", "finalized"],
    default: () => "'draft'",
  })
  status: "draft" | "submitted" | "reviewed" | "finalized" | null;

  @Column("timestamp", {
    name: "created_on",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdOn: Date | null;

  @Column("timestamp", { name: "finalized_on", nullable: true })
  finalizedOn: Date | null;

  @Column("int", { name: "school_id" })
  schoolId: number;

  @OneToMany(
    () => PerformanceScores,
    (performanceScores) => performanceScores.evaluation
  )
  performanceScores: PerformanceScores[];

  @ManyToOne(() => Staff, (staff) => staff.staffPerformanceEvaluations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "evaluator_id", referencedColumnName: "id" }])
  evaluator: Staff;

  @ManyToOne(() => Schools, (schools) => schools.staffPerformanceEvaluations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: Schools;

  @ManyToOne(() => Staff, (staff) => staff.staffPerformanceEvaluations2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "staff_id", referencedColumnName: "id" }])
  staff: Staff;
}
