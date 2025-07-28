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




}
