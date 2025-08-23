import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';

@Controller('v1/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }


  @HttpCode(HttpStatus.OK)
  @Get('get-all-student-attendance')
  async login() {
    return this.attendanceService.getAllStudentAttendance();
  }

  @Get('get-attendance-by-user-and-date')
  getAttendanceByDate(@Query('date') date: string, @Req() req) {
    const user = req.user;
    const roleId = req.roleId; 
    const userId = req.userId; 
    return this.attendanceService.getMonthlyAttendanceSummary(roleId,userId, date);
  }



  @HttpCode(HttpStatus.OK)
  @Post('mark-attendance')
  async markAttendance(@Req() req, @Body() body: CreateAttendanceDto) {
    const user = req['user'];
    const roleId = user.roleId;


    return this.attendanceService.markAttendance(body, roleId);
  }

  @Post('mark-students-bulk-attendance')
  @HttpCode(HttpStatus.OK)
  async markBulkAttendance(
    @Body() body: BulkAttendanceDto,
    @Req() req
  ) {
    const roleId = req.user?.roleId;
    const schoolId = req.user?.school_id; 
    return this.attendanceService.markBulkAttendance(body, roleId, schoolId);
  }

}
