import { Test, TestingModule } from '@nestjs/testing';
import { FeesStructureController } from './fees-structure.controller';
import { FeesStructureService } from './fees-structure.service';

describe('FeesStructureController', () => {
  let controller: FeesStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeesStructureController],
      providers: [FeesStructureService],
    }).compile();

    controller = module.get<FeesStructureController>(FeesStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
