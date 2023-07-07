import { Test, TestingModule } from '@nestjs/testing';
import { CompanyMetricsService } from './company-metrics.service';

describe('CompanyMetricsService', () => {
  let service: CompanyMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyMetricsService],
    }).compile();

    service = module.get<CompanyMetricsService>(CompanyMetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
