import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PerformanceController } from "./performance.controller"
import { PerformanceService } from "./services/PerformanceService"
import { PerformanceCriteria } from "./entities/PerformanceCriteria"
import { StaffPerformanceEvaluation } from "./entities/staff-performance-evaluation.entity"
import { PerformanceScore } from "./entities/PerformanceScore"
import { Staff } from "../staff/entities/staff.entity" // make sure the path is correct

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      PerformanceCriteria,
       StaffPerformanceEvaluation, 
       PerformanceScore,
       Staff
    ]
  )],
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService],
})
export class PerformanceModule { }
