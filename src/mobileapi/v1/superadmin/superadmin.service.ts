import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from '../class/dto/create_school.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schools } from '../entities/schools.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Users } from '../entities/users.entity';
import { BulkStaffDto, CreateStaffDto } from './dto/bulk-staff.dto';
import { Staff } from '../entities/staff.entity';


@Injectable()
export class SuperadminService {
    constructor(
        @InjectRepository(Schools) private schoolsRepository: Repository<Schools>,
        @InjectRepository(Users) private userRepo: Repository<Users>,
        @InjectRepository(Staff) private staffRepository: Repository<Staff>,
        

    ) { }



    async generateThePassword(email: string, password: string) {
        const user = await this.userRepo.findOne({
            where: { email: email },
        });

        const genratedPass = await bcrypt.hash(password, 10);

        const pass = await bcrypt.compare(password, user?.password ?? "");
        if (!pass) {

        }
        return {
            status: 1,
            postPass: password,
            userDBPass: user?.password,
            passwordMatch: pass,
            newPassGen: genratedPass
        }
    }
    
    async checkSuperAdmin() {
        return {
            status: 1,  
            message: "super admin controller check"
        }
    }



    async createSchool(schoolDto: CreateSchoolDto): Promise<any> {

        try {
            const {
                name,
                code,
                address,
                phone,
                email,
                principal_name,
                established_year,
                status = 'active',
            } = schoolDto;

            const newSchool = this.schoolsRepository.create({
                name,
                code,
                address,
                phone,
                email,
                principalName: principal_name,
                establishedYear: established_year,
                status,
            });

            const savedSchool = await this.schoolsRepository.save(newSchool);

            return {
                status: 1,
                message: 'School created successfully',
                schoolId: savedSchool.id,
            };
        } catch (error) {
            console.error('Create School Error:', error);
            return {
                status: 0,
                message: 'Failed to create school',
                error: error.message,
            };
        }
    }





}
