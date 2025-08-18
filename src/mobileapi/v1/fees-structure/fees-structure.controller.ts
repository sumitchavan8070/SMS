import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { FeesStructureService } from './fees-structure.service';
import { FeesStructure } from './entities/fees-structure.entity'; 

@Controller('v1/fees-structure')
export class FeesStructureController {
  constructor(private feesService: FeesStructureService) {}

  @Get(':school_id')
  async getFees(@Param('school_id') school_id: number): Promise<FeesStructure[]> {
    return this.feesService.getFeesBySchool(Number(school_id));
  }

  @Post()
  async createFee(@Body() body: Partial<FeesStructure>): Promise<FeesStructure> {
    return this.feesService.createFee(body);
  }

  @Patch(':school_id/:id')
  async updateFee(
    @Param('school_id') school_id: number,
    @Param('id') id: number,
    @Body() body: Partial<FeesStructure>,
  ): Promise<FeesStructure> {
    return this.feesService.updateFee(Number(school_id), Number(id), body);
  }
}
