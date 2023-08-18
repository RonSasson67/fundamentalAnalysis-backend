import { Injectable } from '@nestjs/common';
import { MultipleValuationResponse } from './DTO/MultipleValuation/MultipleValuationResponse';

const TOKEN = `chj8e69r01qh5480dvg0chj8e69r01qh5480dvgg`;

const calculateAvragePe = (data: any, numberOfYearsBack) => {
  const currentDate = new Date();
  const yearsAgoDate5YearsBack = new Date(
    currentDate.getFullYear() - numberOfYearsBack,
    currentDate.getMonth(),
    currentDate.getDate(),
  );

  const peListTTM = data.series.quarterly.peTTM.filter(
    (pe) => new Date(pe.period) > yearsAgoDate5YearsBack,
  );
  const sum = peListTTM.reduce(
    (accumulator, currentValue) => accumulator + currentValue.v,
    0,
  );

  return sum / peListTTM.length;
};

@Injectable()
export class CompanyValuationService {
  async MultipleValuation(symbol: string): Promise<MultipleValuationResponse> {
    const url = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=ALL&token=${TOKEN}`;
    const urlStock = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${TOKEN}`;
    const yahoourl = `https://finance.yahoo.com/quote/${symbol}/analysis`;

    const response = await fetch(url);
    const yahooResponse = await fetch(yahoourl);
    const stockPriceRespone = await fetch(urlStock);

    const data = await response.json();
    const yahooData = await yahooResponse.text();
    const stockPriceData = await stockPriceRespone.json();

    const textToFinde = `<span>Next 5 Years (per annum)</span></td><td class="Ta(end) Py(10px)">`;
    const indexOfGrowEstamite = yahooData.indexOf(textToFinde);
    let GrowthRateInPrecent = yahooData.substring(
      indexOfGrowEstamite + textToFinde.length,
      indexOfGrowEstamite + textToFinde.length + 10,
    );
    GrowthRateInPrecent = GrowthRateInPrecent.substring(
      0,
      GrowthRateInPrecent.indexOf('%'),
    );

    const peRecomended = calculateAvragePe(data, 5);

    const multipleValuationResponse: MultipleValuationResponse = {
      symbol: data.symbol,
      stockPrice: stockPriceData.c,
      eps: data.metric.epsBasicExclExtraItemsAnnual,
      peRecomended: peRecomended,
      GrowthRateInPrecent: parseFloat(GrowthRateInPrecent),
    };

    return multipleValuationResponse;
  }
}
