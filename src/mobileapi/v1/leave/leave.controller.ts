import { Controller, Get, Post, Put, Body, Param, HttpCode, HttpStatus, ParseIntPipe } from "@nestjs/common"
import type { LeaveService } from "./leave.service"
import type { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto"
import type { UpdateLeaveStatusDto } from "./dto/update-leave-status.dto"
import type { LeaveFilterDto } from "./dto/leave-filter.dto"

@Controller("v1/leave")
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @HttpCode(HttpStatus.OK)
  @Get("types")
  async getLeaveTypes(schoolId?: number) {
    return await this.leaveService.findAllLeaveTypes(schoolId)
  }

  @HttpCode(HttpStatus.OK)
  @Get("applications")
  async getAllApplications(filterDto: LeaveFilterDto) {
    return await this.leaveService.findAllApplications(filterDto)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('applications')
  async createApplication(@Body() createLeaveDto: CreateLeaveApplicationDto) {
    return await this.leaveService.createApplication(createLeaveDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put("applications/:id/status")
  async updateApplicationStatus(@Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: UpdateLeaveStatusDto) {
    return await this.leaveService.updateApplicationStatus(id, updateStatusDto)
  }

  @HttpCode(HttpStatus.OK)
  @Get("analytics")
  async getLeaveAnalysis(schoolId?: number, year?: number) {
    return await this.leaveService.getLeaveAnalysis(schoolId, year)
  }
}
