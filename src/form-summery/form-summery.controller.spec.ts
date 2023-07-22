import { Test, TestingModule } from '@nestjs/testing';
import { FormSummeryController } from './form-summery.controller';

describe('FormSummeryController', () => {
  let controller: FormSummeryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormSummeryController],
    }).compile();

    controller = module.get<FormSummeryController>(FormSummeryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
