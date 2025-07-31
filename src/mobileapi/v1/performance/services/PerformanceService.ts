import type { Repository } from "typeorm"
import {pool }from "../../../../config/db"
import { StaffPerformanceEvaluation } from "../entities/staff-performance-evaluation.entity"
import { PerformanceCriteria } from "../entities/PerformanceCriteria"
import { PerformanceScore } from "../entities/PerformanceScore"
import type {
  CreatePerformanceEvaluationDto,
  UpdatePerformanceEvaluationDto,
  PerformanceFilterDto,
  CreatePerformanceScoreDto,
} from "../dto/CreatePerformanceDto"

export class PerformanceService {
  private evaluationRepository: Repository<StaffPerformanceEvaluation>
  private criteriaRepository: Repository<PerformanceCriteria>
  private scoreRepository: Repository<PerformanceScore>


async findAllEvaluations(filters: PerformanceFilterDto = {}): Promise<any> {
  try {
    const queryBuilder = this.evaluationRepository
      .createQueryBuilder("evaluation")
      .leftJoinAndSelect("evaluation.staff", "staff")
      .leftJoinAndSelect("staff.user", "user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("evaluation.evaluator", "evaluator")
      .leftJoinAndSelect("evaluator.user", "evaluatorUser")
      .leftJoinAndSelect("evaluatorUser.profile", "evaluatorProfile")
      .leftJoinAndSelect("evaluation.scores", "scores")
      .leftJoinAndSelect("scores.criteria", "criteria");

    if (filters.schoolId) {
      queryBuilder.andWhere("evaluation.school_id = :schoolId", { schoolId: filters.schoolId });
    }

    if (filters.staffId) {
      queryBuilder.andWhere("evaluation.staff_id = :staffId", { staffId: filters.staffId });
    }

    if (filters.status) {
      queryBuilder.andWhere("evaluation.status = :status", { status: filters.status });
    }

    if (filters.year) {
      queryBuilder.andWhere("YEAR(evaluation.evaluation_period_end) = :year", { year: filters.year });
    }

    const evaluations = await queryBuilder
      .orderBy("evaluation.evaluation_period_end", "DESC")
      .getMany();

    return {
      status: 1,
      message: evaluations.length ? 'Evaluations retrieved successfully.' : 'No evaluations found.',
      data: evaluations,
    };
  } catch (error) {
    console.error('Find Evaluations Error:', error);
    return {
      status: 0,
      message: 'Failed to retrieve evaluations due to server error.',
    };
  }
}


  async createEvaluation(createEvaluationDto: CreatePerformanceEvaluationDto) {
    const evaluation = this.evaluationRepository.create({
      ...createEvaluationDto,
      evaluation_period_start: createEvaluationDto.evaluation_period_start,
      evaluation_period_end: createEvaluationDto.evaluation_period_end,
    })

    return this.evaluationRepository.save(evaluation)
  }

  async updateEvaluation(id: number, updateEvaluationDto: UpdatePerformanceEvaluationDto) {
    const evaluation = await this.evaluationRepository.findOne({ where: { id } })
    if (!evaluation) {
      throw new Error("Performance evaluation not found")
    }

    Object.assign(evaluation, updateEvaluationDto)

    if (updateEvaluationDto.status === "finalized") {
      evaluation.finalized_on = new Date()
    }

    return this.evaluationRepository.save(evaluation)
  }

  async addScore(createScoreDto: CreatePerformanceScoreDto) {
    const score = this.scoreRepository.create(createScoreDto)
    return this.scoreRepository.save(score)
  }

  async getPerformanceAnalysis(schoolId?: number, year = 2024) {
    const queryBuilder = this.evaluationRepository
      .createQueryBuilder("evaluation")
      .leftJoin("evaluation.staff", "staff")
      .leftJoin("staff.school", "school")
      .select([
        "school.name as school_name",
        "staff.department as department",
        "COUNT(*) as total_staff",
        "AVG(evaluation.overall_score) as avg_performance_score",
        "COUNT(CASE WHEN evaluation.overall_grade IN ('A', 'A+') THEN 1 END) as high_performers",
        "COUNT(CASE WHEN evaluation.overall_grade IN ('C', 'D', 'F') THEN 1 END) as low_performers",
        "AVG(staff.experience_years) as avg_experience",
      ])
      .where("evaluation.status = :status", { status: "finalized" })
      .andWhere("YEAR(evaluation.evaluation_period_end) = :year", { year })
      .andWhere("staff.status = :staffStatus", { staffStatus: "active" })
      .groupBy("school.id, staff.department")
      .orderBy("school.name", "ASC")
      .addOrderBy("avg_performance_score", "DESC")

    if (schoolId) {
      queryBuilder.andWhere("school.id = :schoolId", { schoolId })
    }

    return queryBuilder.getRawMany()
  }

  async getStaffDevelopmentNeeds(schoolId?: number) {
    const queryBuilder = this.evaluationRepository
      .createQueryBuilder("evaluation")
      .leftJoin("evaluation.staff", "staff")
      .leftJoin("staff.school", "school")
      .leftJoin("staff.user", "user")
      .leftJoin("user.profile", "profile")
      .select([
        "school.name as school_name",
        "staff.department as department",
        "profile.full_name as full_name",
        "staff.experience_years as experience_years",
        "COALESCE(evaluation.overall_score, 0) as performance_score",
        "evaluation.areas_for_improvement as areas_for_improvement",
        "evaluation.goals_for_next_period as goals_for_next_period",
        `CASE 
          WHEN staff.experience_years < 2 AND COALESCE(evaluation.overall_score, 0) < 7 THEN 'High Priority Training'
          WHEN staff.experience_years < 5 AND COALESCE(evaluation.overall_score, 0) < 8 THEN 'Medium Priority Training'
          WHEN COALESCE(evaluation.overall_score, 0) < 6 THEN 'Performance Improvement Required'
          ELSE 'Standard Development'
        END as training_priority`,
      ])
      .where("staff.status = :status", { status: "active" })
      .andWhere("(evaluation.status = :evalStatus OR evaluation.id IS NULL)", { evalStatus: "finalized" })
      .andWhere("(evaluation.evaluation_period_end >= :date OR evaluation.id IS NULL)", { date: "2024-01-01" })

    if (schoolId) {
      queryBuilder.andWhere("school.id = :schoolId", { schoolId })
    }

    queryBuilder.orderBy("school.name", "ASC").addOrderBy(`
      CASE training_priority 
        WHEN 'High Priority Training' THEN 1
        WHEN 'Performance Improvement Required' THEN 2
        WHEN 'Medium Priority Training' THEN 3
        ELSE 4
      END
    `)

    return queryBuilder.getRawMany()
  }

  async getCriteria(schoolId?: number) {
    const queryBuilder = this.criteriaRepository
      .createQueryBuilder("criteria")
      .where("criteria.status = :status", { status: "active" })

    if (schoolId) {
      queryBuilder.andWhere("criteria.school_id = :schoolId", { schoolId })
    }

    return queryBuilder.orderBy("criteria.name", "ASC").getMany()
  }
}
