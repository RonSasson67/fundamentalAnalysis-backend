export type DcfValuationResponse = {
  symbol: string;
  stockPrice: number;
  MarketCap: number;
  recomandedMetrics: RecomandedMetrics;
  historicalFinancials: HistoricalFinancial[];
};

export type HistoricalFinancial = {
  years: number;
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
