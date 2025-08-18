import { Module } from '@nestjs/common';
import { AuthModule } from '../v1/auth/auth.module'; // adjust path if different
import { StudentsModule } from './students/students.module';
import { ClassModule } from './class/class.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FeesStructureModule } from './fees-structure/fees-structure.module';
import { FeesModule } from './fees/fees.module';

@Module({
  imports: [
    AuthModule, // ✅ THIS IS REQUIRED
    StudentsModule, ClassModule, AttendanceModule, FeesStructureModule, FeesModule,
    // ... other modules
  ],
})
export class V1Module {}

