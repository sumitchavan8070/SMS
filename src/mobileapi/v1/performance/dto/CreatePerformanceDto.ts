import type { EvaluationStatus } from "../entities/staff-performance-evaluation.entity"

export interface CreatePerformanceEvaluationDto {
  staff_id: number
  evaluation_period_start: Date
  evaluation_period_end: Date
  evaluator_id: number
  overall_score?: number
  overall_grade?: string
  strengths?: string
  areas_for_improvement?: string
  goals_for_next_period?: string
  evaluator_comments?: string
  school_id: number
}

export interface UpdatePerformanceEvaluationDto {
  overall_score?: number
  overall_grade?: string
  strengths?: string
  areas_for_improvement?: string
  goals_for_next_period?: string
  evaluator_comments?: string
  staff_comments?: string
  status?: EvaluationStatus
}

export interface PerformanceFilterDto {
  schoolId?: number
  staffId?: number
  status?: EvaluationStatus
  year?: number
}

export interface CreatePerformanceScoreDto {
  evaluation_id: number
  criteria_id: number
  score: number
  comments?: string
}
