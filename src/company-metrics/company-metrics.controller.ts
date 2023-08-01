import { Controller, Get, Param } from '@nestjs/common';
import { CompanyMetricsService } from './company-metrics.service';
import { RequestMetricsCompeny } from './dto/RequestMetricsCompeny';
import { FinancialData } from './interface/FinancialData.interface';

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

  @Get('/financial-health/:symbol')
  async getFinancialHealthMetrics(@Param() requestMetricsCompeny: RequestMetricsCompeny): Promise<FinancialData[]> {
    return await this.companyService.getFinancialHealthMetrics(requestMetricsCompeny.symbol);
  }
  
  @Get('/profitability/:symbol')
  async getProfitabilityMetrics(@Param() requestMetricsCompeny: RequestMetricsCompeny): Promise<FinancialData[]> {
    return await this.companyService.getProfitabilityMetrics(requestMetricsCompeny.symbol);
  }
  
}
