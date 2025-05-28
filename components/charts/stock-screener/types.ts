export interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  relVolume: number;
  marketCap: string;
  pe: number;
  eps: number;
  epsGrowth: number;
  divYield: number;
  sector: string;
  logo?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  options?: { label: string; value: string }[];
}

export interface SortConfig {
  key: keyof StockData | null;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  allStocks: string;
  market: string;
  watchlist: string;
  index: string;
  price: string;
  changePercent: string;
  marketCap: string;
  pe: string;
  epsGrowth: string;
  divYield: string;
  sector: string;
  analystRating: string;
  performance: string;
  revenueGrowth: string;
  peg: string;
  roe: string;
  beta: string;
  recentEarnings: string;
  upcomingEarnings: string;
}

export type TabType = 
  | 'overview'
  | 'performance'
  | 'extended-hours'
  | 'valuation'
  | 'dividends'
  | 'profitability'
  | 'income-statement'
  | 'balance-sheet'
  | 'cash-flow'
  | 'technicals';

export interface TabConfig {
  id: TabType;
  label: string;
  active?: boolean;
}
