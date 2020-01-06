export interface IEarnings {
  maxAge: number;
  earningsChart: IEarningsChart;
  financialsChart: IFinancialsChart;
}

export interface IEarningsChart {
  quarterly: { date: string; actual: number; estimate: number }[];
  currentQuarterEstimate: number;
  currentQuarterEstimateDate: string;
  currentQuarterEstimateYear: number;
  earningsDate: number[];
}

export interface IFinancialsChart {
  yearly: { date: number; revenue: number; earnings: number; }[];
  quarterly: { date: string; revenue: number; earnings: number }[];
  financialCurrency: string;
}