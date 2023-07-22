import { Test, TestingModule } from '@nestjs/testing';
import { FormSummeryService } from './form-summery.service';

describe('FormSummeryService', () => {
  let service: FormSummeryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormSummeryService],
    }).compile();

    service = module.get<FormSummeryService>(FormSummeryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
