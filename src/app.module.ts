import { Module } from '@nestjs/common';
import { CompanyMetricsService } from './company-metrics/company-metrics.service';
import { CompanyMetricsController } from './company-metrics/company-metrics.controller';
import { FormSummeryController } from './form-summery/form-summery.controller';
import { FormSummeryService } from './form-summery/form-summery.service';
import { FormSummeryController } from './form-summery/form-summery.controller';

@Module({
  imports: [],
  controllers: [CompanyMetricsController, FormSummeryController],
  providers: [CompanyMetricsService, FormSummeryService],
})
export class AppModule {}
