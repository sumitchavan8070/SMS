import { Module } from '@nestjs/common';
import { AuthModule } from '../v1/auth/auth.module'; // adjust path if different
import { StudentsModule } from './students/students.module';
import { ClassModule } from './class/class.module';

@Module({
  imports: [
    AuthModule, // ✅ THIS IS REQUIRED
    StudentsModule, ClassModule,
    // ... other modules
  ],
})
export class V1Module {}

