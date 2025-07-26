import { Module } from '@nestjs/common';
import { AuthModule } from '../v1/auth/auth.module'; // adjust path if different

@Module({
  imports: [
    AuthModule, // ✅ THIS IS REQUIRED
    // ... other modules
  ],
})
export class V1Module {}
