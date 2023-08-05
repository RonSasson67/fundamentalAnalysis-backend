import { IsString, Length } from 'class-validator';

export class RequestMetricsCompeny {
  @IsString()
  @Length(1, 6)
  symbol: string;
}
