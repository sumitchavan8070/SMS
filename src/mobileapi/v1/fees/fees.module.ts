// src/fees/fees.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { Fee } from './entities/fee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fee]), // <-- Add your Fee entity here
  ],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService], // Export if other modules need it
})
export class FeesModule {}
