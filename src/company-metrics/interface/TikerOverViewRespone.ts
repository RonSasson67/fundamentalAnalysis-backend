export type TikerOverViewRespone = {
  companyData: {
    homeExchange: string;
    industry: string | null;
    inWatchlistCount: number;
    ipoDaysAgo: number;
    isBank: boolean;
    isReit: boolean;
    name: string;
    primaryTicker: string | null;
    reportedCurrency: string;
    symbolPriceCurrency: string;
    ticker: string;
  };
  dividendData: {
    ebitdaPayoutRatio: number | null;
    exDividendDate: string | null;
    fcfPayoutRatio: number | null;
    ffoPayoutRatio: number | null;
    frequency: string;
    ocfPayoutRatio: number | null;
    payDate: string | null;
    payoutRatio: number | null;
    rate: number | null;
    yield: number | null;
  };
  priceTargets: {
    conversionRate: number;
    fromCurrency: string;
    high: number | null;
    low: number | null;
    mean: number | null;
    targetDate: string;
    toCurrency: string;
  };
  priceRatios: {
    averageInterestRate: number | null;
    earningsYield: number | null;
    efficiencyRatio: number | null;
    forwardPe: number | null;
    ffoYield: number | null;
    freeCashFlowYield: number | null;
    interestIncome: number | null;
    nonInterestIncome: number | null;
    priceBook: number | null;
    priceEarningsTtm: number | null;
    priceToFfoTtm: number | null;
    priceFreeCashflowTtm: number | null;
    priceSalesTtm: number | null;
  };
  shareStatsData: {
    currentPrice: number | null;
    earningsPerShareTtm: number | null;
    marketCap: number | null;
    marketCapCurrency: string;
    marketCapNew: number | null;
    nextEarningsDate: string | null;
    nextEarningsHour: string | null;
    sharesOutstanding: number | null;
    ttmStockPriceHigh: number | null;
    ttmStockPriceLow: number | null;
  };
};
