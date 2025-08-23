import { Controller, Get, HttpCode, HttpStatus, Post, Body, Req, Query, Param } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateSchoolDto } from './dto/create_school.dto';
import { CreateStaffDto } from './dto/create_staff_dto';

@Controller('v1/class')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @HttpCode(HttpStatus.OK)
  @Get('get-all-classes')
  async getAllClasses() {
    return await this.classService.getAllClasses();
  }


  @Get('get-all-subjects')
  @HttpCode(HttpStatus.OK)
  async getAllSubjects() {
    return await this.classService.getAllSubjects();
  }


  @HttpCode(HttpStatus.OK)
  @Post('create-new-class')
  async createClass(@Body() body: { class_name: string }) {
    return await this.classService.createClass(body.class_name);
  }

  @Post('get-subject-by-class-id')
  @HttpCode(HttpStatus.OK)
  async getSubjectsByClassId(@Body() body: { class_id: number }) {
    const { class_id } = body;
    if (!class_id) {
      return {
        status: 0,
        message: 'class_id is required',
      };
    }
    return await this.classService.getSubjectsByClassId(class_id);
  }



  @Post('get-subjects-by-teacher-id')
  @HttpCode(HttpStatus.OK)
  async getSubjectsByTeacherId(@Req() req: Request) {
    const user = req['user'];
    const userId = user.userId;
    const roleId = user.roleId;


    return await this.classService.getSubjectsByTeacherId(userId, roleId);
  }




  @HttpCode(HttpStatus.OK)
  @Get('get-all-students-by-school')
  async getStudentsBySchool(@Req() req: Request) {
    const user = req['user'];
    const schoolId = user.school_id;
    return this.classService.getStudentsBySchoolId(schoolId);
  }


  @HttpCode(HttpStatus.OK)
  @Get('get-terachers-as-per-school')
  async getTeachersBySchool(@Req() req: Request) {
    const user = req['user'];
    const schoolId = user.school_id;

    return this.classService.getTeachersBySchoolId(schoolId);
  }

  // admin api 
  @HttpCode(HttpStatus.OK)
  @Get('get-fee-status-by-school')
  async getFeeSummaryBySchool(@Req() req: Request) {
    const user = req['user'];
    const schoolId = user.school_id;

    return this.classService.getFeeSummaryBySchool();
  }


  @HttpCode(HttpStatus.OK)
  @Get('get-fee-status-by-school')
  async getSubjectTeacherDetailsBySchoolId(@Req() req: Request) {
    const user = req['user'];
    const schoolId = user.school_id;

    return this.classService.getSubjectTeacherDetailsBySchoolId(schoolId);
  }

  @Post('create-new-staff-member')
  @HttpCode(HttpStatus.OK)
  async creaateNewStaffMember(@Body() createStaffData: CreateStaffDto) {
    return await this.classService.createStaff(createStaffData);
  }


  @Get('get-staff-by-school-id')
  @HttpCode(HttpStatus.OK)
  async getStaffBySchoolId(@Req() req: Request) {
    const user = req['user'];
    const schoolId = user.school_id;
    return await this.classService.getStaffBySchoolId(schoolId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update-staff-details')
  async updateStaff(
    @Req() req: Request,
    @Body() updateData: CreateStaffDto,
  ) {
    const user = req['user'];
    const userId = user.userId;

    return this.classService.updateStaffByUserId(userId, updateData);
  }

  @HttpCode(HttpStatus.OK)
  @Get('get-satff-details')
  async getStaffDetailsByUserId(
    @Req() req: Request,
  ) {
    const user = req['user'];
    const userId = user.userId;

    return this.classService.getStaffDetailsByUserId(userId);
  }


  @Get('get-satff-details')

  async getSalaryByUserId(@Req() req: Request,) {
    const user = req['user'];
    const userId = user.userId;
    return this.classService.getSalaryByUserId(userId);
  }


  @Post('mark-attendance')
  async markStaffAttendanceByUserId(@Body() body: { user_id: number; date: string; status: string }) {
    return this.classService.markStaffAttendanceByUserId(
      body.user_id,
      body.date,
      body.status
    );
  }

  @Get('staff/:staffId/leaves')
  async getStaffLeaves(
    @Param('staffId') staffId: number,
    @Query('status') status?: string
  ) {
    return this.classService.getLeavesByStaff(staffId, status);
  }




  @Get('get-students-by-class')
  async getClassAttendance(
    // @Query('schoolId') schoolId: number,
    @Query('date') date: string,
    @Req() req: Request,
  ) {
    const user = req['user'];
    const userId = user.userId;
    const schoolId = user.school_id;

    return this.classService.getStudentsByClassAndSchool(
      Number(userId),
      Number(schoolId),
      date
    );
  }

  @Get('get-fees-list-by-class-teacher')
  async getFeesListByClassTeacher(
    @Req() req: Request,
  ) {
    const user = req['user'];
    const userId = user.userId;
    const schoolId = user.school_id;

    return this.classService.getFeesListByClassTeacher(
      Number(userId),
    );
  }



  @Get('get-fees-list-by-class-teacher-v2')
  async getFeesListByClassTeacherv2(
    @Req() req: Request,
  ) {
    const user = req['user'];
    const userId = user.userId;
    const schoolId = user.school_id;

    return this.classService.getFeesListBySchool(
      Number(1),
    );
  }




  // @Post('staff/:staffId/leaves')
  // async applyLeave(
  //   @Param('staffId') staffId: number,
  //   @Body() dto: ApplyLeaveDto
  // ) {
  //   return this.leaveService.applyForLeave(staffId, dto);
  // }

  // @Patch('leaves/:leaveId/approval')
  // async updateLeaveStatus(
  //   @Param('leaveId') leaveId: number,
  //   @Body() dto: { status: 'approved' | 'rejected'; approved_by: number; rejection_reason?: string }
  // ) {
  //   return this.leaveService.updateLeaveStatus(leaveId, dto);
  // }


//  for check only 
  @HttpCode(HttpStatus.OK)
  @Get('getSchoolDepartmentAnalytics')
  async getSchoolDepartmentAnalytics(@Req() req: Request) {
    const user = req['user'];
    const schoolId = user.school_id;
    return this.classService.getSchoolDepartmentAnalytics(schoolId);
  }


}

