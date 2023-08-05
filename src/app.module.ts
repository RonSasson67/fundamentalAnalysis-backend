import { Module } from '@nestjs/common';
import { CompanyMetricsService } from './company-metrics/company-metrics.service';
import { CompanyMetricsController } from './company-metrics/company-metrics.controller';
import { CompanyValuationService } from './company-valuation/company-valuation.service';
import { CompanyValuationController } from './company-valuation/company-valuation.controller';

@Module({
  imports: [],
  controllers: [CompanyMetricsController, CompanyValuationController],
  providers: [CompanyMetricsService, CompanyValuationService],
})
export class AppModule {}
