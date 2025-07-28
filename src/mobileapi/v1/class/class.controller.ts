import { Controller, Get, HttpCode, HttpStatus, Post, Body, Req } from '@nestjs/common';
import { ClassService } from './class.service';

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
  async getSubjectsByTeacherId(@Body() body: { teacher_user_id: number }) {
    const { teacher_user_id } = body;

    if (!teacher_user_id) {
      return {
        status: 0,
        message: 'teacher_user_id is required',
      };
    }

    return await this.classService.getSubjectsByTeacherId(teacher_user_id);
  }
}

