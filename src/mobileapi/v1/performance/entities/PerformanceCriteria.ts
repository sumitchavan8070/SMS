import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { School } from "../../school/entities/School"
import { PerformanceScore } from "./PerformanceScore"

export enum CriteriaStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("performance_criteria")
export class PerformanceCriteria {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  school_id: number

  @Column({ length: 100 })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ default: 10 })
  max_score: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 10.0 })
  weight_percentage: number

  @Column({ type: "text", nullable: true })
  applicable_departments: string

  @Column({
    type: "enum",
    enum: CriteriaStatus,
    default: CriteriaStatus.ACTIVE,
  })
  status: CriteriaStatus

  // Relations
  @ManyToOne(() => School)
  @JoinColumn({ name: "school_id" })
  school: School

  @OneToMany(
    () => PerformanceScore,
    (score) => score.criteria,
  )
  scores: PerformanceScore[]
}
