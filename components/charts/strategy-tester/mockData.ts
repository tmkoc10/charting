import { StrategyResults, EquityPoint, DrawdownPoint, TradeRecord } from './types';

// Generate realistic equity curve data
const generateEquityHistory = (): EquityPoint[] => {
  const points: EquityPoint[] = [];
  const startValue = 1000000;
  let currentValue = startValue;
  const totalTrades = 1001;
  const targetEndValue = 1191879.41;

  for (let i = 0; i <= totalTrades; i++) {
    // Calculate progress towards target
    const progress = i / totalTrades;
    const targetValue = startValue + (targetEndValue - startValue) * progress;

    // Add realistic volatility around the target trajectory
    const volatility = 3000 * (1 + Math.sin(i * 0.1)); // Varying volatility
    const randomChange = (Math.random() - 0.5) * volatility;

    // Blend target trajectory with random walk
    currentValue = targetValue * 0.7 + currentValue * 0.3 + randomChange;

    // Ensure we don't go below 95% of start value
    currentValue = Math.max(currentValue, startValue * 0.95);

    // Ensure we end exactly at target
    if (i === totalTrades) {
      currentValue = targetEndValue;
    }

    points.push({
      time: new Date(2020, 0, 1 + i * 0.5).toISOString(), // Roughly 2 trades per day
      value: currentValue,
      tradeNumber: i
    });
  }

  return points;
};

// Generate drawdown data
const generateDrawdownHistory = (equityHistory: EquityPoint[]): DrawdownPoint[] => {
  const drawdowns: DrawdownPoint[] = [];
  let peak = equityHistory[0].value;

  equityHistory.forEach((point) => {
    if (point.value > peak) {
      peak = point.value;
    }

    const drawdown = peak - point.value;

    drawdowns.push({
      time: point.time,
      value: -drawdown, // Negative for drawdown
      tradeNumber: point.tradeNumber
    });
  });

  return drawdowns;
};

// Generate buy & hold equity data
const generateBuyHoldEquity = (equityHistory: EquityPoint[]): EquityPoint[] => {
  const buyHoldPoints: EquityPoint[] = [];
  const startValue = 1000000;
  const endValue = 1150000; // Slightly lower than strategy performance
  const totalPoints = equityHistory.length;

  equityHistory.forEach((point, index) => {
    // Simple linear growth for buy & hold
    const progress = index / (totalPoints - 1);
    const value = startValue + (endValue - startValue) * progress;

    buyHoldPoints.push({
      time: point.time,
      value,
      tradeNumber: point.tradeNumber
    });
  });

  return buyHoldPoints;
};

// Generate sample trades
const generateTrades = (): TradeRecord[] => {
  const trades: TradeRecord[] = [];
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'META', 'AMZN'];

  for (let i = 0; i < 1001; i++) {
    const isWin = Math.random() < 0.7892; // 78.92% win rate
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const side = Math.random() > 0.5 ? 'long' : 'short';
    const entryPrice = 100 + Math.random() * 400;
    const quantity = Math.floor(Math.random() * 100) + 10;

    let exitPrice: number;
    if (isWin) {
      exitPrice = entryPrice * (1 + Math.random() * 0.05); // 0-5% gain
    } else {
      exitPrice = entryPrice * (1 - Math.random() * 0.03); // 0-3% loss
    }

    const pnl = (exitPrice - entryPrice) * quantity * (side === 'short' ? -1 : 1);
    const pnlPercent = ((exitPrice - entryPrice) / entryPrice) * 100 * (side === 'short' ? -1 : 1);

    trades.push({
      id: `trade_${i + 1}`,
      entryTime: new Date(2020, 0, 1 + i * 0.5).toISOString(),
      exitTime: new Date(2020, 0, 1 + i * 0.5 + Math.random() * 2).toISOString(),
      symbol,
      side,
      entryPrice,
      exitPrice,
      quantity,
      pnl,
      pnlPercent,
      commission: quantity * 0.005, // $0.005 per share
      duration: Math.floor(Math.random() * 1440) + 30 // 30 minutes to 1 day
    });
  }

  return trades;
};

const equityHistory = generateEquityHistory();
const drawdownHistory = generateDrawdownHistory(equityHistory);
const buyHoldEquity = generateBuyHoldEquity(equityHistory);
const trades = generateTrades();

// Calculate metrics from generated data
const profitableTrades = trades.filter(t => t.pnl > 0).length;
const losingTrades = trades.length - profitableTrades;
const grossProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));

export const mockStrategyResults: StrategyResults = {
  strategyName: "Hybrid: RSI + Breakout + Dashboard + PineConnector",
  timeframe: "1D",
  period: {
    start: "2020-01-01",
    end: "2024-05-28"
  },
  initialCapital: 1000000,
  metrics: {
    totalPnL: 191879.41,
    totalPnLPercent: 19.19,
    maxDrawdown: 5079.70,
    maxDrawdownPercent: 0.46,
    totalTrades: 1001,
    profitableTrades,
    winRate: 78.92,
    profitFactor: 5.92,
    grossProfit,
    grossLoss,
    avgWin: grossProfit / profitableTrades,
    avgLoss: grossLoss / losingTrades,
    largestWin: Math.max(...trades.map(t => t.pnl)),
    largestLoss: Math.min(...trades.map(t => t.pnl)),
    sharpeRatio: 2.34,
    sortinoRatio: 3.12
  },
  equityHistory,
  drawdownHistory,
  buyHoldEquity,
  trades,
  isDeepBacktesting: true
};
