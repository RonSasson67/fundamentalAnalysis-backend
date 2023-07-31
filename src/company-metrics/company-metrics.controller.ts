import { Controller, Get, Param } from '@nestjs/common';
import { CompanyMetricsService } from './company-metrics.service';
import { FinancialData } from './interface/FinancialData.interface';
import { RequestMetricsCompeny } from './dto/RequestMetricsCompeny';

@Controller('metrics')
export class CompanyMetricsController {
    constructor(private readonly companyService: CompanyMetricsService) {}
    
  @Get('/overview/:symbol')
  async getOverViewMetrics(@Param() requestMetricsCompeny: RequestMetricsCompeny): Promise<FinancialData[]> {
    return await this.companyService.getOverViewMeteics(requestMetricsCompeny.symbol);
  }

  @Get('/valuation/:symbol')
  async getValuationMetrics(@Param() requestMetricsCompeny: RequestMetricsCompeny): Promise<FinancialData[]> {
    return await this.companyService.getValuationMetrics(requestMetricsCompeny.symbol);
  }
}
