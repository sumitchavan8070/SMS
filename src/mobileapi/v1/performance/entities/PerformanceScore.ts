import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { StaffPerformanceEvaluation } from "./staff-performance-evaluation.entity"
import { PerformanceCriteria } from "./PerformanceCriteria"

@Entity("performance_scores")
export class PerformanceScore {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  evaluation_id: number

  @Column()
  criteria_id: number

  @Column({ type: "decimal", precision: 4, scale: 2 })
  score: number

  @Column({ type: "text", nullable: true })
  comments: string

  // Relations
  @ManyToOne(
    () => StaffPerformanceEvaluation,
    (evaluation) => evaluation.scores,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "evaluation_id" })
  evaluation: StaffPerformanceEvaluation

  @ManyToOne(
    () => PerformanceCriteria,
    (criteria) => criteria.scores,
  )
  @JoinColumn({ name: "criteria_id" })
  criteria: PerformanceCriteria
}
