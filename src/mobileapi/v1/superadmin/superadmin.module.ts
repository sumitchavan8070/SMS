import { Module } from '@nestjs/common';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Classes } from '../entities/classes.entity';
import { Fees } from '../entities/fees.entity';
import { Parents } from '../entities/parents.entity';
import { PerformanceCriteria } from '../entities/performancecriteria.entity';
import { Roles } from '../entities/roles.entity';
import { Salaries } from '../entities/salaries.entity';
import { Schools } from '../entities/schools.entity';
import { Staff } from '../entities/staff.entity';
import { StaffAttendance } from '../entities/staffattendance.entity';
import { StaffLeaveApplications } from '../entities/staffleaveapplications.entity';
import { StaffQualifications } from '../entities/staffqualifications.entity';
import { Students } from '../entities/students.entity';
import { Subjects } from '../entities/subjects.entity';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/userprofile.entity';
import { UserProfiles } from '../entities/userprofiles.entity';
import { Users } from '../entities/users.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User, UserProfile, Users,
      UserProfiles,
      Students,
      Parents,
      Staff,
      Classes,
      Roles,
      Subjects,
      Schools,
      Fees,
      StaffQualifications,
      Salaries,
      StaffAttendance,
      StaffLeaveApplications,
      Attendance,
      PerformanceCriteria,
      User
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: process.env.JWT_SECRET || 'defaultSecret',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
      }),
    }),
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
  exports: [SuperadminService], // Exported if used in other modules
})
export class SuperadminModule { }
