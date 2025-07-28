import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get } from '@nestjs/common';
import { StudentsService } from './students.service';


@Controller('v1/students')
export class StudentsController {

    constructor(private readonly studentsService: StudentsService) { }





    @HttpCode(HttpStatus.OK)
    @Get('get-client-parents')

    async getClientParents(@Req() req: Request) {
        const user = req['user'];
        const userId = user.userId;

        return await this.studentsService.getClientParents(userId);
    }


    @HttpCode(HttpStatus.OK)
    @Get('get-all-students')
    async getAllStudents(@Req() req: Request) {


        return await this.studentsService.getAllStudents();
    }



    @HttpCode(HttpStatus.OK)
    @Get('get-student-by-id')
    async getUserById(@Req() req: Request) {
        const user = req['user'];
        const userId = user.userId;

        return await this.studentsService.getStudentById(userId);
    }

    @Get('get-parents-by-student-id')
    @HttpCode(HttpStatus.OK)
    async getParentsByStudentId(@Req() req: Request) {
        const user = req['user'];
        const userId = user.userId;
        return await this.studentsService.getParentsByStudentId(userId);
    }


    @Post('link-parent-to-student')
    @HttpCode(HttpStatus.OK)
    async linkParentToStudent(@Body() body: { parent_user_id: number; student_id: number }) {
        return await this.studentsService.linkParentToStudent(body.parent_user_id, body.student_id);
    }



}
