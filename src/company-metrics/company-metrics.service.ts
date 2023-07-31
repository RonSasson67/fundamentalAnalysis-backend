import { Injectable } from '@nestjs/common';
import { FinancialData } from './interface/FinancialData.interface';
import axios from 'axios';

type TikerOverViewRespone = {
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
  
  const adaptValue = (value: number | string | null | undefined, precision?: number, suffix?: string): string => {
    const fallbackValue = '--';

    if (value === null || value === undefined) {
        return fallbackValue;
    }
    if (typeof value === 'number') {
        const magnitude = Math.abs(value);
        if (magnitude >= 1e12) {
        return `${(value / 1e12).toFixed(precision)}T`;
        }
        if (magnitude >= 1e9) {
        return `${(value / 1e9).toFixed(precision)}B`;
        }
        if (magnitude >= 1e6) {
        return `${(value / 1e6).toFixed(precision)}M`;
        }
        return precision !== undefined ? value.toFixed(precision) : value.toString();
    }
    return value;
    };

@Injectable()
export class CompanyMetricsService {
    async getOverViewMeteics(symbol: string): Promise<FinancialData[]> {
        const url = `https://api.stockunlock.com/stockDetails/getTickerOverview?ticker=${symbol}`
        const tikerOverViewRespone : TikerOverViewRespone = (await axios.get<TikerOverViewRespone>(url)).data;

        const adaptedData = [
        { title: "Market Cap", value: adaptValue(tikerOverViewRespone.shareStatsData.marketCapNew || tikerOverViewRespone.shareStatsData.marketCap, 2) },
        { title: "Industry", value: adaptValue(tikerOverViewRespone.companyData.industry) },
        { title: "EPS (TTM)", value: adaptValue(tikerOverViewRespone.shareStatsData.earningsPerShareTtm, 2) },
        { title: "P/E (TTM)", value: adaptValue(tikerOverViewRespone.priceRatios.priceEarningsTtm, 2) },
        { title: "Div & Yield", value: `${adaptValue(tikerOverViewRespone.dividendData.rate, 2)} (${adaptValue(tikerOverViewRespone.dividendData.yield, 2, '%')})` },
        { title: "FCF Payout Ratio", value: adaptValue(tikerOverViewRespone.dividendData.fcfPayoutRatio, 2, '%') },
        { title: "P/S (TTM)", value: adaptValue(tikerOverViewRespone.priceRatios.priceSalesTtm, 2) },
        { title: "P/B", value: adaptValue(tikerOverViewRespone.priceRatios.priceBook, 2) },
        { title: "Shares Outstanding", value: adaptValue(tikerOverViewRespone.shareStatsData.sharesOutstanding, 2) },
        { title: "Ex-Dividend", value: adaptValue(tikerOverViewRespone.dividendData.exDividendDate) },
        { title: "Next Earnings", value: adaptValue(tikerOverViewRespone.shareStatsData.nextEarningsDate) },
        { title: "Forward P/E", value: adaptValue(tikerOverViewRespone.priceRatios.forwardPe, 2) },
        { title: "Payout Ratio", value: adaptValue(Number(tikerOverViewRespone.dividendData.payoutRatio), 2, '%') },
        { title: "P/FCF (TTM)", value: adaptValue(tikerOverViewRespone.priceRatios.priceFreeCashflowTtm, 2) },
        { title: "FCF Yield", value: adaptValue(tikerOverViewRespone.priceRatios.freeCashFlowYield, 2, '%') },
        { title: "Earnings Yield", value: adaptValue(tikerOverViewRespone.priceRatios.earningsYield, 2, '%') },
        ];

        return adaptedData;
      }

    async getValuationMetrics(symbol: string): Promise<FinancialData[]> {
      const url = `https://api.stockunlock.com/stockDetails/getTickerOverview?ticker=${symbol}`
      const tikerOverViewRespone : TikerOverViewRespone = (await axios.get<TikerOverViewRespone>(url)).data;
      
      const adaptedData = [
        { title: "P/E (TTM)", value: adaptValue(tikerOverViewRespone.priceRatios.priceEarningsTtm, 2) },
        { title: "Forward P/E", value: adaptValue(tikerOverViewRespone.priceRatios.forwardPe, 2) },
        { title: "P/FCF (TTM)", value: adaptValue(tikerOverViewRespone.priceRatios.priceFreeCashflowTtm, 2) },
        { title: "P/S (TTM)", value: adaptValue(tikerOverViewRespone.priceRatios.priceSalesTtm, 2) },
        ];
        
        return adaptedData;
    }
}
