import { Module } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';
import { StaffLeaveApplications } from '../entities/staffleaveapplications.entity';
import { LeaveTypes } from '../entities/leavetypes.entity';
import { Users } from '../entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffLeaveApplications, LeaveTypes, Users]),
  ],
  controllers: [LeavesController],
  providers: [LeavesService],
})
export class LeavesModule { }
