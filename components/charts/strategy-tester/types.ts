export interface StrategyMetrics {
  totalPnL: number;
  totalPnLPercent: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  totalTrades: number;
  profitableTrades: number;
  winRate: number;
  profitFactor: number;
  grossProfit: number;
  grossLoss: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  sharpeRatio?: number;
  sortinoRatio?: number;
}

export interface TradeRecord {
  id: string;
  entryTime: string;
  exitTime: string;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  commission: number;
  duration: number; // in minutes
}

export interface EquityPoint {
  time: string;
  value: number;
  tradeNumber: number;
}

export interface DrawdownPoint {
  time: string;
  value: number;
  tradeNumber: number;
}

export interface StrategyResults {
  strategyName: string;
  timeframe: string;
  period: {
    start: string;
    end: string;
  };
  initialCapital: number;
  metrics: StrategyMetrics;
  equityHistory: EquityPoint[];
  drawdownHistory: DrawdownPoint[];
  buyHoldEquity?: EquityPoint[];
  trades: TradeRecord[];
  isDeepBacktesting: boolean;
}

export type TabType = 'overview' | 'performance' | 'trades-analysis' | 'risk-ratios' | 'trades-list';

export interface ChartToggleState {
  equity: boolean;
  drawdown: boolean;
  buyHold: boolean;
}

export type ViewMode = 'absolute' | 'percentage';
