import { Controller, Get, Param } from '@nestjs/common';
import { CompanyValuationService } from './company-valuation.service';
import { RequestMetricsCompeny } from 'src/dto/RequestMetricsCompeny';
import { MultipleValuationResponse } from './DTO/MultipleValuation/MultipleValuationResponse';

@Controller('valuation')
export class CompanyValuationController {
    constructor(private readonly companyValuationService: CompanyValuationService) {}

    @Get('/multiple/:symbol')
    getCompanyValuation(@Param() requestMetricsCompeny: RequestMetricsCompeny): Promise<MultipleValuationResponse> {
        return this.companyValuationService.MultipleValuation(requestMetricsCompeny.symbol);
    }
}
