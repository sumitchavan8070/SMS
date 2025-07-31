import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common"
import type { StaffService } from "./staff.service"
import type { CreateStaffDto } from "./dto/create-staff.dto"
import type { UpdateStaffDto } from "./dto/update-staff.dto"
import type { StaffFilterDto } from "./dto/staff-filter.dto"

@Controller("v1/staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllStaff(filterDto: StaffFilterDto) {
    return await this.staffService.findAll(filterDto)
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getStaffById(@Param('id', ParseIntPipe) id: number) {
    return await this.staffService.findById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createStaff(@Body() createStaffDto: CreateStaffDto) {
    return await this.staffService.create(createStaffDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put(":id")
  async updateStaff(@Param('id', ParseIntPipe) id: number, @Body() updateStaffDto: UpdateStaffDto) {
    return await this.staffService.update(id, updateStaffDto)
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteStaff(@Param('id', ParseIntPipe) id: number) {
    return await this.staffService.delete(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('analytics/department-count')
  async getDepartmentWiseCount(@Query('schoolId') schoolId?: number) {
    return await this.staffService.getDepartmentWiseCount(schoolId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('analytics/hierarchy')
  async getStaffHierarchy(@Query('schoolId') schoolId?: number) {
    return await this.staffService.getStaffHierarchy(schoolId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('analytics/summary')
  async getStaffWithSummary(@Query('schoolId') schoolId?: number) {
    return await this.staffService.getStaffWithSummary(schoolId);
  }
}
