import { Module } from '@nestjs/common';
import { AuthModule } from '../v1/auth/auth.module'; // adjust path if different
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    AuthModule, // ✅ THIS IS REQUIRED
    StudentsModule,
    // ... other modules
  ],
})
export class V1Module {}

