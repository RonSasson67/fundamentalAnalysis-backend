import { Controller, Get, Param } from '@nestjs/common';
import { RequestMetricsCompeny } from 'src/dto/RequestMetricsCompeny';
import { DcfValuationResponse } from './interface/DcfValuation/DcfValuationResponse';
import { MultipleValuationResponse } from './interface/MultipleValuation/MultipleValuationResponse';
import { CompanyValuationService } from './company-valuation.service';

@Controller('valuation')
export class CompanyValuationController {
  constructor(private readonly companyValuationService: CompanyValuationService) {}

  @Get('/multiple/:symbol')
  getCompanyMultipleValuation(@Param() requestMetricsCompeny: RequestMetricsCompeny): Promise<MultipleValuationResponse> {
    return this.companyValuationService.MultipleValuation(requestMetricsCompeny.symbol);
  }

  @Get('/dcf/:symbol')
  getCompanyDcfValuation(@Param() requestMetricsCompeny: RequestMetricsCompeny): Promise<DcfValuationResponse> {
    return this.companyValuationService.DcfValuation(requestMetricsCompeny.symbol);
  }
}
