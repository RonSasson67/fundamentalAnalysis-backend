import { Module } from '@nestjs/common';
import { CompanyMetricsService } from './company-metrics/company-metrics.service';
import { CompanyMetricsController } from './company-metrics/company-metrics.controller';

@Module({
  imports: [],
  controllers: [CompanyMetricsController],
  providers: [CompanyMetricsService],
})
export class AppModule {}
