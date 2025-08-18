// fees.controller.ts
import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { FeesService } from './fees.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';

@Controller('v1/student-fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  // Get all fees for a school
  @Get(':school_id')
  getAllFees(@Param('school_id') school_id: number) {
    return this.feesService.getAllFeesBySchool(Number(school_id));
  }

  // Get fees for a student
  @Get(':school_id/:student_id')
  getStudentFees(@Param('school_id') school_id: number, @Param('student_id') student_id: number) {
    return this.feesService.getFeesByStudent(Number(school_id), Number(student_id));
  }

  // Add a new fee
  @Post()
  addFee(@Body() dto: CreateFeeDto) {
    return this.feesService.createFee(dto);
  }

  // Update a fee
  @Patch(':fee_id')
  updateFee(@Param('fee_id') fee_id: number, @Body() dto: UpdateFeeDto) {
    return this.feesService.updateFee(Number(fee_id), dto);
  }
}
