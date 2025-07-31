import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Salary } from "./entities/salary.entity"
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Salary])],
  controllers: [SalaryController],
  providers: [SalaryService],
  exports: [SalaryService],
})
export class SalaryModule {}
