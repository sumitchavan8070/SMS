import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

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
    return this.attendanceService.getMonthlyAttendanceSummary(user.roleId, user.userId, date);
  }



  @HttpCode(HttpStatus.OK)
  @Post('mark-attendance')
  async markAttendance(@Req() req, @Body() body: CreateAttendanceDto) {
    const user = req['user'];
    const roleId = user.roleId;


    return this.attendanceService.markAttendance(body, roleId);
  }



}
