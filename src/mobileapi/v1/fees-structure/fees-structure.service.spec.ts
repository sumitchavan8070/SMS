import { Test, TestingModule } from '@nestjs/testing';
import { FeesStructureService } from './fees-structure.service';

describe('FeesStructureService', () => {
  let service: FeesStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeesStructureService],
    }).compile();

    service = module.get<FeesStructureService>(FeesStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
