import { Injectable } from '@nestjs/common';
import { MultipleValuationResponse } from './DTO/MultipleValuation/MultipleValuationResponse';


const TOKEN = `chj8e69r01qh5480dvg0chj8e69r01qh5480dvgg`

@Injectable()
export class CompanyValuationService {
   


    async MultipleValuation(symbol: string): Promise<MultipleValuationResponse> {    
        const url = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=ALL&token=${TOKEN}`;
        const yahoourl = `https://finance.yahoo.com/quote/${symbol}/analysis`
        
        const response = await fetch(url);
        const yahooResponse = await fetch(yahoourl);

        const data = await response.json();
        const yahooData = await yahooResponse.text();

        const textToFinde = `<span>Next 5 Years (per annum)</span></td><td class="Ta(end) Py(10px)">`
        const indexOfGrowEstamite = yahooData.indexOf(textToFinde);
        let GrowthRateInPrecent = (yahooData.substring(indexOfGrowEstamite + textToFinde.length , indexOfGrowEstamite + textToFinde.length + 10));
        GrowthRateInPrecent = GrowthRateInPrecent.substring(0, GrowthRateInPrecent.indexOf('%'));

        const multipleValuationResponse: MultipleValuationResponse = {
            symbol: data.symbol,
            eps: data.metric.epsBasicExclExtraItemsAnnual,
            peRecomended: data.metric.peExclExtraTTM,
            GrowthRateInPrecent: parseFloat(GrowthRateInPrecent)
        };

        return multipleValuationResponse;
    }
}
