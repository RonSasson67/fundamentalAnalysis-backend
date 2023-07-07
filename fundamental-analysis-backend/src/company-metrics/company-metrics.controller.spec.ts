import { Test, TestingModule } from '@nestjs/testing';
import { CompanyMetricsController } from './company-metrics.controller';

describe('CompanyMetricsController', () => {
  let controller: CompanyMetricsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyMetricsController],
    }).compile();

    controller = module.get<CompanyMetricsController>(CompanyMetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
