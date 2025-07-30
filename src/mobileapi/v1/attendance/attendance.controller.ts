import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get } from '@nestjs/common';
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

  @HttpCode(HttpStatus.OK)
  @Post('get-attendance-by-user-and-date')
  getAttendanceByDate(@Req() req, @Body() body) {
    
    return this.attendanceService.getAttendanceByDateRange(req.user, body);
  }


  @HttpCode(HttpStatus.OK)
  @Post('mark-attendance')
  async markAttendance(@Req() req, @Body() body: CreateAttendanceDto) {
    const user = req['user'];
    const roleId = user.roleId;

    return this.attendanceService.markAttendance( body,roleId );
  }



}
