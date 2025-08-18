import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { CreateSchoolDto } from '../class/dto/create_school.dto';

@Controller('v1/su')
export class SuperadminController {

    constructor(private readonly superAdminService: SuperadminService) { }


    @HttpCode(HttpStatus.OK)
    @Get("check")
    async check() {
        return this.superAdminService.checkSuperAdmin();
    }

    // For create a new school 
    @Post('create-new-school')
    @HttpCode(HttpStatus.OK)
    async createSchool(@Body() body: CreateSchoolDto) {
        return await this.superAdminService.createSchool(body);
    }

  @Post('generate-password')
  async generatePassword(@Body() body: any) {
    const { email, password } = body;
    return this.superAdminService.generateThePassword(email, password);
  }


//   @Post('bulk-create')
//   async bulkCreate(@Body() staffData: BulkStaffDto[]) {
//     return this.superAdminService.bulkCreateOrUpdateStaff(staffData);
//   }



}
