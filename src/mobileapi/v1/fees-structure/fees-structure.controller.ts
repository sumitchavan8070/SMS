import { Controller, Get, Param, Post, Body, Patch, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { FeesStructureService } from './fees-structure.service';
import { FeesStructure } from './entities/fees-structure.entity';

@Controller('v1/fees-structure')
export class FeesStructureController {
  
  constructor(private readonly feesService: FeesStructureService) { }

  @HttpCode(HttpStatus.OK)  
  @Get()
  async getFees(@Req() req: Request){
    const user = req['user'];
    const schooldId = user.school_id;
    console.log("School ID:", schooldId);

    return this.feesService.getFeesBySchool(schooldId);
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
