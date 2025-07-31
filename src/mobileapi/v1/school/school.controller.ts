import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from "@nestjs/common"
import type { SchoolService } from "./school.service"
import type { CreateSchoolDto } from "./dto/create-school.dto"
import type { UpdateSchoolDto } from "./dto/update-school.dto"

@Controller("v1/schools")
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllSchools() {
    return await this.schoolService.findAll()
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getSchoolById(@Param('id') id: string) {
    return await this.schoolService.findById(Number.parseInt(id));
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.create(createSchoolDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put(":id")
  async updateSchool(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return await this.schoolService.update(Number.parseInt(id), updateSchoolDto)
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteSchool(@Param('id') id: string) {
    return await this.schoolService.delete(Number.parseInt(id));
  }
}
