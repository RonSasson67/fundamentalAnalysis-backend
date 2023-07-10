import { Controller, Get, Param } from '@nestjs/common';
import { CompanyMetricsService } from './company-metrics.service';
import { FinancialData } from './interface/FinancialData.interface';
import { RequestMetricsCompeny } from './dto/RequestMetricsCompeny';

@Controller('metrics')
export class CompanyMetricsController {
    constructor(private readonly companyService: CompanyMetricsService) {}
    
  @Get('overview/:symbol')
  async getOverViewMetrics(@Param() requestMetricsCompeny: RequestMetricsCompeny): Promise<FinancialData[]> {
    return await this.companyService.getOverViewMereics(requestMetricsCompeny.symbol);
  }
}
