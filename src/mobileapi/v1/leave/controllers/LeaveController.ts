import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { LeaveService } from '../leave.service'; 
import { CreateLeaveApplicationDto, UpdateLeaveStatusDto, LeaveFilterDto } from '../dto/CreateLeaveDto';

@Controller('v1/leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('types')
  @HttpCode(HttpStatus.OK)
  async getLeaveTypes(@Query('schoolId') schoolId?: string) {
    const schoolIdNum = schoolId ? parseInt(schoolId) : undefined;
    const leaveTypes = await this.leaveService.findAllLeaveTypes(schoolIdNum);
    return {
      success: true,
      data: leaveTypes,
      message: 'Leave types retrieved successfully',
    };
  }

  @Get('applications')
  @HttpCode(HttpStatus.OK)
  async getAllApplications(
    @Query('schoolId') schoolId?: string,
    @Query('staffId') staffId?: string,
    @Query('status') status?: string,
    @Query('year') year?: string,
  ) {
    const filters: LeaveFilterDto = {
      schoolId: schoolId ? parseInt(schoolId) : undefined,
      staffId: staffId ? parseInt(staffId) : undefined,
      // status: status ? status : undefined,
      year: year ? parseInt(year) : undefined,
    };

    const applications = await this.leaveService.findAllApplications(filters);
    return {
      success: true,
      data: applications,
      message: 'Leave applications retrieved successfully',
    };
  }

  @Post('application')
  @HttpCode(HttpStatus.OK)
  async createApplication(@Body() body: CreateLeaveApplicationDto) {
    const requiredFields = [
      'staff_id',
      'leave_type_id',
      'start_date',
      'end_date',
      'total_days',
      'reason',
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

    const dto: CreateLeaveApplicationDto = {
      ...body,
      start_date: new Date(body.start_date),
      end_date: new Date(body.end_date),
    };

    const application = await this.leaveService.createApplication(dto);
    return {
      success: true,
      data: application,
      message: 'Leave application created successfully',
    };
  }

  @Post('application/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateLeaveStatusDto,
  ) {
    if (!['approved', 'rejected', 'cancelled'].includes(updateStatusDto.status)) {
      return {
        success: false,
        error: 'Invalid status',
      };
    }

    const updated = await this.leaveService.updateApplicationStatus(parseInt(id), updateStatusDto);
    return {
      success: true,
      data: updated,
      message: 'Leave application status updated successfully',
    };
  }

  @Get('analysis')
  @HttpCode(HttpStatus.OK)
  async getAnalysis(
    @Query('schoolId') schoolId?: string,
    @Query('year') year = '2024',
  ) {
    const schoolIdNum = schoolId ? parseInt(schoolId) : undefined;
    const yearNum = parseInt(year);

    const analysis = await this.leaveService.getLeaveAnalysis(schoolIdNum, yearNum);
    return {
      success: true,
      data: analysis,
      message: 'Leave analysis retrieved successfully',
    };
  }
}
