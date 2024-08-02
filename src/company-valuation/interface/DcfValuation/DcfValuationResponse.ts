export type DcfValuationResponse = {
  symbol: string;
  stockPrice: number;
  MarketCap: number;
  recomandedMetrics: RecomandedMetrics;
  historicalFinancials: HistoricalFinancial[];
  stockPricesAllHistory: stockPrice[];
};

export type HistoricalFinancial = {
  year: number;
  netIncome: number;
  revenue: number;
  cashFromOperations: number;
  freeCashFlow: number;
};

export type RecomandedMetrics = {
  priceToErnings: number;
  priceTofcf: number;
  discountRate: number;
  growthRate: number;
  terminalGrowthRate: number;
};

export type stockPrice = {
  date: number;
  close: number;
};
