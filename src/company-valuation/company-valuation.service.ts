import { Injectable } from '@nestjs/common';
import { DcfValuationResponse, HistoricalFinancial } from './interface/DcfValuation/DcfValuationResponse';
import { MultipleValuationResponse } from './interface/MultipleValuation/MultipleValuationResponse';

const FINNHUB_TOKEN = `ck6qs5pr01qmp9pd4l90ck6qs5pr01qmp9pd4l9g`;
const ALPHA_TOKEN = 'EWPHM6EUSRM2H5VT';

@Injectable()
export class CompanyValuationService {
  async MultipleValuation(symbol: string): Promise<MultipleValuationResponse> {
    const urlMetrics = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=ALL&token=${FINNHUB_TOKEN}`;
    const urlStockPrice = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_TOKEN}`;

    // Get the grow rate in precent first because it takes the longest time
    const growRatePromise = GetGrowRateInPrecent(symbol);

    // featch all the data in parallel
    const StockPricePromise = fetch(urlStockPrice);
    const MetricsPromise = fetch(urlMetrics);

    // Wait for both promises to resolve
    try {
      await Promise.all([StockPricePromise, MetricsPromise]);
    } catch (error) {
      console.log(error);
      return null;
    }

    const StockPriceRespone = await (await StockPricePromise).json();
    const MetricsRespone = await (await MetricsPromise).json();

    // build the response
    const GrowthRateInPrecent = await growRatePromise;
    const peRecomended = calculateAverageMetric(MetricsRespone, 'peTTM', 5);

    const multipleValuationResponse: MultipleValuationResponse = {
      symbol: MetricsRespone.symbol,
      stockPrice: StockPriceRespone.c,
      eps: MetricsRespone.metric.epsBasicExclExtraItemsAnnual,
      peRecomended: peRecomended,
      GrowthRateInPrecent: GrowthRateInPrecent,
    };

    return multipleValuationResponse;
  }

  async DcfValuation(symbol: string): Promise<DcfValuationResponse> {
    const urlStockPrice = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_TOKEN}`;
    const urlMetrics = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_TOKEN}`;
    const urlFinancialsReport = `https://finnhub.io/api/v1/stock/financials-reported?symbol=${symbol}&token=${FINNHUB_TOKEN}`;
    const urlStockPricesAllHistory = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${ALPHA_TOKEN}`;

    // Get the grow rate in precent first because it takes the longest time
    const growRatePromise = GetGrowRateInPrecent(symbol);

    // featch all the data in parallel
    const StockPricePromise = fetch(urlStockPrice);
    const MetricsPromise = fetch(urlMetrics);
    const FinancialsReportPromise = fetch(urlFinancialsReport);
    const StockPricesAllHistoryPromise = fetch(urlStockPricesAllHistory);

    // Wait for all promises to resolve
    try {
      await Promise.all([StockPricePromise, MetricsPromise, FinancialsReportPromise, StockPricesAllHistoryPromise]);
    } catch (error) {
      console.log(error);
      return null;
    }
    const StockPriceRespone = await (await StockPricePromise).json();
    const MetricsRespone = await (await MetricsPromise).json();
    const FinancialsReportRespone = await (await FinancialsReportPromise).json();
    const StockPricesAllHistoryRespone = await (await StockPricesAllHistoryPromise).json();

    const stockPricesAllHistory = Object.entries(StockPricesAllHistoryRespone['Weekly Adjusted Time Series'])
      .map(([date, values]) => ({
        date: new Date(date).getTime(), // timestamp
        close: parseFloat(values['4. close']),
      }))
      .reverse();

    // build the response
    const peRecomended = calculateAverageMetric(MetricsRespone, 'peTTM', 5);
    const pfcfRecommended = calculateAverageMetric(MetricsRespone, 'pfcfTTM', 5);

    const historicalFinancials = GetMetricsFromFinancilasReport(FinancialsReportRespone, 5).slice(0).reverse();
    const growthRateInPrecent = await growRatePromise;

    const dcfValuationResponse: DcfValuationResponse = {
      symbol: MetricsRespone.symbol,
      stockPrice: StockPriceRespone.c,
      MarketCap: MetricsRespone.metric.marketCapitalization,
      recomandedMetrics: {
        priceToErnings: peRecomended,
        priceTofcf: pfcfRecommended,
        discountRate: 8,
        growthRate: growthRateInPrecent,
        terminalGrowthRate: 2,
      },
      historicalFinancials: historicalFinancials,
      stockPricesAllHistory: stockPricesAllHistory,
    };

    return dcfValuationResponse;
  }
}

const GetMetricsFromFinancilasReport = (FinancialsReportRespone: any, yearsBack: number): HistoricalFinancial[] => {
  const currentYear = new Date().getFullYear();
  const pastYearsData = FinancialsReportRespone.data.filter(
    (item) => item.year >= currentYear - yearsBack && item.year <= currentYear,
  );

  return pastYearsData.map((item) => {
    const netIncomeItem = item.report.ic.find((concept) => concept.concept === 'us-gaap_NetIncomeLoss');
    const revenueItem = item.report.ic.find((concept) => concept.label === 'Net sales');
    const cashFromOperationsItem = item.report.cf.find(
      (concept) => concept.concept === 'us-gaap_NetCashProvidedByUsedInOperatingActivities',
    );
    const CapitalExpended = item.report.cf.find(
      (concept) => concept.concept === 'us-gaap_PaymentsToAcquirePropertyPlantAndEquipment',
    );
    const freeCashFlow = cashFromOperationsItem.value - CapitalExpended.value;

    const historicalFinancial: HistoricalFinancial = {
      year: item.year,
      netIncome: netIncomeItem ? netIncomeItem.value / 1000000 : 0,
      revenue: revenueItem ? revenueItem.value / 1000000 : 0,
      cashFromOperations: cashFromOperationsItem ? cashFromOperationsItem.value / 1000000 : 0,
      freeCashFlow: freeCashFlow / 1000000,
    };
    return historicalFinancial;
  });
};

const GetGrowRateInPrecent = async (symbol: string): Promise<number> => {
  const yahoourl = `https://finance.yahoo.com/quote/${symbol}/analysis`;

  const yahooResponse = await fetch(yahoourl);
  const yahooData = await yahooResponse.text();

  const textToFinde = `<span>Next 5 Years (per annum)</span></td><td class="Ta(end) Py(10px)">`;
  const indexOfGrowEstamite = yahooData.indexOf(textToFinde);
  let GrowthRateInPrecent = yahooData.substring(
    indexOfGrowEstamite + textToFinde.length,
    indexOfGrowEstamite + textToFinde.length + 10,
  );
  GrowthRateInPrecent = GrowthRateInPrecent.substring(0, GrowthRateInPrecent.indexOf('%'));
  const growthRate = parseFloat(GrowthRateInPrecent);

  return isNaN(growthRate) ? 8 : growthRate;
};

const calculateAverageMetric = (data: any, metric: string, numberOfYearsBack: number) => {
  const currentDate = new Date();
  const yearsAgoDate = new Date(currentDate.getFullYear() - numberOfYearsBack, currentDate.getMonth(), currentDate.getDate());

  const metricList = data.series.quarterly[metric].filter((item) => new Date(item.period) > yearsAgoDate);

  if (metricList.length === 0) {
    return 0; // Handle the case where no data is available
  }

  const sum = metricList.reduce((accumulator, currentValue) => accumulator + currentValue.v, 0);

  return sum / metricList.length;
};
