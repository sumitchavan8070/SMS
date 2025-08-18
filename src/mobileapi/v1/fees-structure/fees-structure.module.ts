import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesStructure } from './entities/fees-structure.entity'; 
import { FeesStructureService } from './fees-structure.service';
import { FeesStructureController } from './fees-structure.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeesStructure])],
  providers: [FeesStructureService],
  controllers: [FeesStructureController],
})
export class FeesStructureModule {}
