export interface IChart {
  result: {
    meta: IChartMetadata;
    timestamp: number[];
    indicators: {
      quote: {
        low: number[];
        volume: number[];
        close: number[];
        open: number[];
        high: number[];
      }[]
    }
  }[]
}

export interface IChartMetadata{
  currency: string;
  symbol: string;
  exchangeName: string;
  instrumentType: string;
  firstTradeDate: number;
  regularMarketTime: number;
  gmtoffset: number;
  timezone: string;
  exchangeTimezoneName: string;
  regularMarketPrice: number;
  chartPreviousClose: number;
  previousClose: number;
  scale: number;
  priceHint: number;
  currentTradingPeriod: ICurrentTradingPeriod;
  tradingPeriods: ITradingPeriod[][];
  dataGranularity: string;
  range: string;
  validRanges: string[] 
}

export interface ICurrentTradingPeriod{
  pre: ITradingPeriod;
  regular: ITradingPeriod;
  post: ITradingPeriod;
}

export interface ITradingPeriod{
  timezone: string;
  start: number;
  end: number;
  gmtoffset: number;
}