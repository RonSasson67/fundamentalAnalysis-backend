import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { FinancialData } from './interface/FinancialData.interface';

const alphaApi = '63LB1YBTAOR1RTSX'

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
        { title: "Div & Yield", value: `${adaptValue(tikerOverViewRespone.dividendData.rate, 2)} (${adaptValue(tikerOverViewRespone.dividendData.yield, 2, '%')})` },
        { title: "Shares Outstanding", value: adaptValue(tikerOverViewRespone.shareStatsData.sharesOutstanding, 2) },
        { title: "Ex-Dividend", value: adaptValue(tikerOverViewRespone.dividendData.exDividendDate) },
        { title: "Next Earnings", value: adaptValue(tikerOverViewRespone.shareStatsData.nextEarningsDate) },
        { title: "Payout Ratio", value: adaptValue(Number(tikerOverViewRespone.dividendData.payoutRatio), 2, '%') },
        { title: "Earnings Yield", value: adaptValue(tikerOverViewRespone.priceRatios.earningsYield, 2, '%') },
        ];

        return adaptedData;
      }

    async getValuationMetrics(symbol: string): Promise<FinancialData[]> {
      const urlOverView = `https://api.stockunlock.com/stockDetails/getTickerOverview?ticker=${symbol}`
      const tikerOverViewRespone : TikerOverViewRespone = (await axios.get<TikerOverViewRespone>(urlOverView)).data;

      const priceFreeCashFlow = tikerOverViewRespone.priceRatios.priceFreeCashflowTtm;

      const functionApi = 'OVERVIEW';
      const url = `https://www.alphavantage.co/query?function=${functionApi}&symbol=${symbol}&apikey=${alphaApi}`
      const overviewRespone = (await axios.get(url)).data;
      
      const priceErningsRatio = overviewRespone['PERatio'];
      const fowrardPriceErningsRatio = overviewRespone['ForwardPE'];
      const priceSalesRatio = overviewRespone['PriceToSalesRatioTTM'];
      const priceErningsGrowgh = overviewRespone['PEGRatio']

      const adaptedData = [
        { title: "P/E (TTM)", value: adaptValue(priceErningsRatio, 2) },
        { title: "Forward P/E", value: adaptValue(fowrardPriceErningsRatio, 2) },
        { title: "P/FCF (TTM)", value: adaptValue(priceFreeCashFlow, 2) },
        { title: "P/S (TTM)", value: adaptValue(priceSalesRatio, 2) },
        { title: "Forward PEG", value: adaptValue(priceErningsGrowgh, 2) },
        ];

        return adaptedData;
    }

    async getFinancialHealthMetrics(symbol: string): Promise<FinancialData[]> {
      const functionApi = 'BALANCE_SHEET';
      const url = `https://www.alphavantage.co/query?function=${functionApi}&symbol=${symbol}&apikey=${alphaApi}`
      const balanceSheetRespone = (await axios.get(url)).data;
                                    
      const currentRatio = balanceSheetRespone['annualReports'][0]['totalCurrentAssets'] /balanceSheetRespone['annualReports'][0]['totalCurrentLiabilities'];
      const financialLeverage = balanceSheetRespone['annualReports'][0]['totalLiabilities'] /balanceSheetRespone['annualReports'][0]['totalShareholderEquity'];
      
      const adaptedData = [
        { title: "Current Ratio", value: adaptValue(currentRatio, 2) },
        { title: "financial leverage", value: adaptValue(financialLeverage, 2) },
        ];
        return adaptedData;
    }

    async getProfitabilityMetrics(symbol: string): Promise<FinancialData[]> {
      const functionApiOverView = 'OVERVIEW';
      const functionApiIncomeStatment = 'INCOME_STATEMENT';

      const urlOverView = `https://www.alphavantage.co/query?function=${functionApiOverView}&symbol=${symbol}&apikey=${alphaApi}`
      const urlIncomeStatment = `https://www.alphavantage.co/query?function=${functionApiIncomeStatment}&symbol=${symbol}&apikey=${alphaApi}`
      const overviewRespone = (await axios.get(urlOverView)).data;
      const IncomeStatmentRespone = (await axios.get(urlIncomeStatment)).data;
      
      const ReturnOnEquity = overviewRespone['ReturnOnEquityTTM'] * 100 ;
      const ProfitMargin = IncomeStatmentRespone['annualReports'][0]['grossProfit'] / IncomeStatmentRespone['annualReports'][0]['totalRevenue'] * 100;
      const OperatingMarginTTM = IncomeStatmentRespone['annualReports'][0]['operatingIncome'] / IncomeStatmentRespone['annualReports'][0]['totalRevenue'] * 100;
      const NetIncomeMargin = IncomeStatmentRespone['annualReports'][0]['netIncome'] / IncomeStatmentRespone['annualReports'][0]['totalRevenue'] * 100;

      const adaptedData = [
        { title: "Return On Equity", value: adaptValue(ReturnOnEquity, 2) + '%' },
        { title: "Profit Margin(TTM)", value: adaptValue(ProfitMargin, 2) + '%' },
        { title: "Operating margin(TTM)", value: adaptValue(OperatingMarginTTM, 2) + '%' },
        { title: "Net Income Margin", value: adaptValue(NetIncomeMargin, 2) + '%' },
        ];
        return adaptedData;
    }
}
