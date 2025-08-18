// fees.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee } from './entities/fee.entity';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(Fee)
    private readonly feeRepo: Repository<Fee>,
  ) {}

  async getAllFeesBySchool(school_id: number) {
    return this.feeRepo.find({ where: { school_id } });
  }

  async getFeesByStudent(school_id: number, student_id: number) {
    return this.feeRepo.find({ where: { school_id, student_id } });
  }

  async createFee(dto: CreateFeeDto) {
    const fee = this.feeRepo.create(dto);
    return this.feeRepo.save(fee);
  }

  async updateFee(fee_id: number, dto: UpdateFeeDto) {
    await this.feeRepo.update(fee_id, dto);
    return this.feeRepo.findOne({ where: { id: fee_id } });
  }
}
