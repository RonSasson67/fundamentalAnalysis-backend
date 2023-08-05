import { Test, TestingModule } from '@nestjs/testing';
import { CompanyValuationService } from './company-valuation.service';

describe('CompanyValuationService', () => {
  let service: CompanyValuationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyValuationService],
    }).compile();

    service = module.get<CompanyValuationService>(CompanyValuationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
