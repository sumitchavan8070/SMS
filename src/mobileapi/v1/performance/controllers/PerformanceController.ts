import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PerformanceService } from '../services/PerformanceService';
import {
  CreatePerformanceEvaluationDto,
  UpdatePerformanceEvaluationDto,
  PerformanceFilterDto,
  CreatePerformanceScoreDto,
} from '../dto/CreatePerformanceDto';

@Controller('v1/performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('evaluations')
  @HttpCode(HttpStatus.OK)
  async getAllEvaluations(
    @Query('type') type?: string,
    @Query('schoolId') schoolId?: string,
    @Query('staffId') staffId?: string,
    @Query('status') status?: string,
    @Query('year') year?: string,
  ) {
    if (type === 'analysis') {
      const schoolIdNum = schoolId ? parseInt(schoolId) : undefined;
      const yearNum = year ? parseInt(year) : 2024;
      const data = await this.performanceService.getPerformanceAnalysis(schoolIdNum, yearNum);
      return {
        success: true,
        data,
        message: 'Performance analysis retrieved successfully',
      };
    }

    if (type === 'development-needs') {
      const schoolIdNum = schoolId ? parseInt(schoolId) : undefined;
      const data = await this.performanceService.getStaffDevelopmentNeeds(schoolIdNum);
      return {
        success: true,
        data,
        message: 'Development needs retrieved successfully',
      };
    }

    const filters: PerformanceFilterDto = {
      schoolId: schoolId ? parseInt(schoolId) : undefined,
      staffId: staffId ? parseInt(staffId) : undefined,
      year: year ? parseInt(year) : undefined,
    };

    const evaluations = await this.performanceService.findAllEvaluations(filters);
    return {
      success: true,
      data: evaluations,
      message: 'Performance evaluations retrieved successfully',
    };
  }

  @Post('evaluation')
  @HttpCode(HttpStatus.OK)
  async createEvaluation(@Body() body: CreatePerformanceEvaluationDto) {
    const requiredFields = [
      'staff_id',
      'evaluation_period_start',
      'evaluation_period_end',
      'evaluator_id',
      'school_id',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return {
          success: false,
          error: `Missing required field: ${field}`,
        };
      }
    }

    const dto: CreatePerformanceEvaluationDto = {
      ...body,
      evaluation_period_start: new Date(body.evaluation_period_start),
      evaluation_period_end: new Date(body.evaluation_period_end),
    };

    const evaluation = await this.performanceService.createEvaluation(dto);
    return {
      success: true,
      data: evaluation,
      message: 'Performance evaluation created successfully',
    };
  }

  @Post('evaluation/:id')
  @HttpCode(HttpStatus.OK)
  async updateEvaluation(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdatePerformanceEvaluationDto,
  ) {
    const evaluation = await this.performanceService.updateEvaluation(parseInt(id), updateEvaluationDto);
    return {
      success: true,
      data: evaluation,
      message: 'Performance evaluation updated successfully',
    };
  }

  @Post('score')
  @HttpCode(HttpStatus.OK)
  async addScore(@Body() body: CreatePerformanceScoreDto) {
    const requiredFields = ['evaluation_id', 'criteria_id', 'score'];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return {
          success: false,
          error: `Missing required field: ${field}`,
        };
      }
    }

    const score = await this.performanceService.addScore(body);
    return {
      success: true,
      data: score,
      message: 'Performance score added successfully',
    };
  }

  @Get('criteria')
  @HttpCode(HttpStatus.OK)
  async getCriteria(@Query('schoolId') schoolId?: string) {
    const schoolIdNum = schoolId ? parseInt(schoolId) : undefined;
    const criteria = await this.performanceService.getCriteria(schoolIdNum);
    return {
      success: true,
      data: criteria,
      message: 'Performance criteria retrieved successfully',
    };
  }
}
