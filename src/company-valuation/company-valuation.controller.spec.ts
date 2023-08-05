import { Test, TestingModule } from '@nestjs/testing';
import { CompanyValuationController } from './company-valuation.controller';

describe('CompanyValuationController', () => {
  let controller: CompanyValuationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyValuationController],
    }).compile();

    controller = module.get<CompanyValuationController>(CompanyValuationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
