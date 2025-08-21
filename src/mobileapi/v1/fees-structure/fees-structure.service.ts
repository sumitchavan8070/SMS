import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeesStructure } from './entities/fees-structure.entity'; 

@Injectable()
export class FeesStructureService {
  constructor(
    @InjectRepository(FeesStructure)
    private feesRepo: Repository<FeesStructure>,
  ) {}

  // Get all fees for a school
  async getFeesBySchool(school_id: number) {
    return this.feesRepo.find({ where: { school_id } });
    
  }

  // Create new fee structure
  async createFee(data: Partial<FeesStructure>): Promise<FeesStructure> {
    const fee = this.feesRepo.create(data);
    return this.feesRepo.save(fee);
  }

  // Update fee structure by id and school_id
  async updateFee(
    school_id: number,
    id: number,
    data: Partial<FeesStructure>,
  ): Promise<FeesStructure> {
    const fee = await this.feesRepo.findOne({ where: { id, school_id } });
    if (!fee) throw new Error('Fee structure not found');
    Object.assign(fee, data);
    return this.feesRepo.save(fee);
  }
}
