import { Injectable } from '@nestjs/common';
import { MultipleValuationResponse } from './DTO/MultipleValuation/MultipleValuationResponse';

const TOKEN = `chj8e69r01qh5480dvg0chj8e69r01qh5480dvgg`

@Injectable()
export class CompanyValuationService {
   


    async MultipleValuation(symbol: string): Promise<MultipleValuationResponse> {    
        const url = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=ALL&token=${TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log(data.metric);
        
        const multipleValuationResponse: MultipleValuationResponse = {
            symbol: data.symbol,
            eps: data.metric.epsBasicExclExtraItemsAnnual,
            peRecomended: data.metric.peExclExtraTTM,
            GrowthRateInPrecent: data.metric.epsGrowth5Y
        };

        return multipleValuationResponse;
    }
}
