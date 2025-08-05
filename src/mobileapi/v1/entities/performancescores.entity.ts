import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PerformanceCriteria } from "./performancecriteria.entity";
import { StaffPerformanceEvaluations } from "./staffperformanceevaluations.entity";

@Index("evaluation_id", ["evaluationId"], {})
@Index("criteria_id", ["criteriaId"], {})
@Entity("performance_scores", { schema: "sms" })
export class PerformanceScores {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "evaluation_id" })
  evaluationId: number;

  @Column("int", { name: "criteria_id" })
  criteriaId: number;

  @Column("decimal", { name: "score", precision: 4, scale: 2 })
  score: string;

  @Column("text", { name: "comments", nullable: true })
  comments: string | null;

  @ManyToOne(
    () => PerformanceCriteria,
    (performanceCriteria) => performanceCriteria.performanceScores,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "criteria_id", referencedColumnName: "id" }])
  criteria: PerformanceCriteria;

  @ManyToOne(
    () => StaffPerformanceEvaluations,
    (staffPerformanceEvaluations) =>
      staffPerformanceEvaluations.performanceScores,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "evaluation_id", referencedColumnName: "id" }])
  evaluation: StaffPerformanceEvaluations;
}
