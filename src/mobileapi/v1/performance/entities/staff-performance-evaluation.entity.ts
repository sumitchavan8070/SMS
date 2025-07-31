import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Staff } from "../../staff/entities/staff.entity" 
import { School } from "../../school/entities/school.entity"
import { PerformanceScore } from "./PerformanceScore"

export enum EvaluationStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  REVIEWED = "reviewed",
  FINALIZED = "finalized",
}

@Entity("staff_performance_evaluations")
export class StaffPerformanceEvaluation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  staff_id: number

  @Column({ type: "date" })
  evaluation_period_start: Date

  @Column({ type: "date" })
  evaluation_period_end: Date

  @Column()
  evaluator_id: number

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  overall_score: number

  @Column({ length: 5, nullable: true })
  overall_grade: string

  @Column({ type: "text", nullable: true })
  strengths: string

  @Column({ type: "text", nullable: true })
  areas_for_improvement: string

  @Column({ type: "text", nullable: true })
  goals_for_next_period: string

  @Column({ type: "text", nullable: true })
  evaluator_comments: string

  @Column({ type: "text", nullable: true })
  staff_comments: string

  @Column({
    type: "enum",
    enum: EvaluationStatus,
    default: EvaluationStatus.DRAFT,
  })
  status: EvaluationStatus

  @CreateDateColumn()
  created_on: Date

  @Column({ type: "timestamp", nullable: true })
  finalized_on: Date

  @Column()
  school_id: number

  // Relations
  @ManyToOne(
    () => Staff,
    (staff) => staff.performanceEvaluations,
  )
  @JoinColumn({ name: "staff_id" })
  staff: Staff

  @ManyToOne(() => Staff)
  @JoinColumn({ name: "evaluator_id" })
  evaluator: Staff

  @ManyToOne(() => School)
  @JoinColumn({ name: "school_id" })
  school: School

  @OneToMany(
    () => PerformanceScore,
    (score) => score.evaluation,
  )
  scores: PerformanceScore[]
}
