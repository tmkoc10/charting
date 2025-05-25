// Technical Indicators Library
// This file contains calculation functions for various technical indicators

export type OHLCData = {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
};

export type IndicatorResult = {
  timestamp: number;
  value: number | { [key: string]: number };
};

// Simple Moving Average
export function calculateSMA(data: OHLCData[], period: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0);
    const average = sum / period;
    
    results.push({
      timestamp: data[i].timestamp,
      value: average
    });
  }
  
  return results;
}

// Exponential Moving Average
export function calculateEMA(data: OHLCData[], period: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for the first value
  let ema = data.slice(0, period).reduce((acc, candle) => acc + candle.close, 0) / period;
  
  results.push({
    timestamp: data[period - 1].timestamp,
    value: ema
  });
  
  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close * multiplier) + (ema * (1 - multiplier));
    results.push({
      timestamp: data[i].timestamp,
      value: ema
    });
  }
  
  return results;
}

// Relative Strength Index
export function calculateRSI(data: OHLCData[], period: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, period).reduce((acc, gain) => acc + gain, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((acc, loss) => acc + loss, 0) / period;
  
  // Calculate RSI for each period
  for (let i = period; i < data.length; i++) {
    if (i > period) {
      avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
    }
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    results.push({
      timestamp: data[i].timestamp,
      value: rsi
    });
  }
  
  return results;
}

// Bollinger Bands
export function calculateBollingerBands(data: OHLCData[], period: number, stdDev: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const closes = slice.map(candle => candle.close);
    
    // Calculate SMA (middle band)
    const sma = closes.reduce((acc, close) => acc + close, 0) / period;
    
    // Calculate standard deviation
    const variance = closes.reduce((acc, close) => acc + Math.pow(close - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    // Calculate bands
    const upperBand = sma + (standardDeviation * stdDev);
    const lowerBand = sma - (standardDeviation * stdDev);
    
    results.push({
      timestamp: data[i].timestamp,
      value: {
        upper: upperBand,
        middle: sma,
        lower: lowerBand
      }
    });
  }
  
  return results;
}

// MACD (Moving Average Convergence Divergence)
export function calculateMACD(data: OHLCData[], fastPeriod: number, slowPeriod: number, signalPeriod: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  // Calculate MACD line
  const macdLine: { timestamp: number; value: number }[] = [];
  const startIndex = Math.max(fastEMA.length, slowEMA.length) - Math.min(fastEMA.length, slowEMA.length);
  
  for (let i = startIndex; i < Math.min(fastEMA.length, slowEMA.length); i++) {
    const fastValue = typeof fastEMA[i].value === 'number' ? fastEMA[i].value as number : 0;
    const slowValue = typeof slowEMA[i].value === 'number' ? slowEMA[i].value as number : 0;
    
    macdLine.push({
      timestamp: fastEMA[i].timestamp,
      value: fastValue - slowValue
    });
  }
  
  // Calculate signal line (EMA of MACD line)
  const signalLine = calculateEMA(
    macdLine.map(point => ({
      open: point.value,
      high: point.value,
      low: point.value,
      close: point.value,
      timestamp: point.timestamp
    })),
    signalPeriod
  );
  
  // Combine MACD and signal
  for (let i = 0; i < signalLine.length; i++) {
    const macdValue = macdLine[i + (macdLine.length - signalLine.length)]?.value || 0;
    const signalValue = typeof signalLine[i].value === 'number' ? signalLine[i].value as number : 0;
    
    results.push({
      timestamp: signalLine[i].timestamp,
      value: {
        macd: macdValue,
        signal: signalValue,
        histogram: macdValue - signalValue
      }
    });
  }
  
  return results;
}

// Stochastic Oscillator
export function calculateStochastic(data: OHLCData[], kPeriod: number, dPeriod: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  const kValues: number[] = [];
  
  // Calculate %K values
  for (let i = kPeriod - 1; i < data.length; i++) {
    const slice = data.slice(i - kPeriod + 1, i + 1);
    const highest = Math.max(...slice.map(candle => candle.high));
    const lowest = Math.min(...slice.map(candle => candle.low));
    const current = data[i].close;
    
    const k = ((current - lowest) / (highest - lowest)) * 100;
    kValues.push(k);
  }
  
  // Calculate %D values (SMA of %K)
  for (let i = dPeriod - 1; i < kValues.length; i++) {
    const dValue = kValues.slice(i - dPeriod + 1, i + 1).reduce((acc, k) => acc + k, 0) / dPeriod;
    
    results.push({
      timestamp: data[i + kPeriod].timestamp,
      value: {
        k: kValues[i],
        d: dValue
      }
    });
  }
  
  return results;
}

// Average True Range
export function calculateATR(data: OHLCData[], period: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  const trueRanges: number[] = [];
  
  // Calculate True Range for each period
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    
    trueRanges.push(tr);
  }
  
  // Calculate ATR (SMA of True Range)
  for (let i = period - 1; i < trueRanges.length; i++) {
    const atr = trueRanges.slice(i - period + 1, i + 1).reduce((acc, tr) => acc + tr, 0) / period;
    
    results.push({
      timestamp: data[i + 1].timestamp,
      value: atr
    });
  }
  
  return results;
}

// Williams %R
export function calculateWilliamsR(data: OHLCData[], period: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const highest = Math.max(...slice.map(candle => candle.high));
    const lowest = Math.min(...slice.map(candle => candle.low));
    const current = data[i].close;
    
    const williamsR = ((highest - current) / (highest - lowest)) * -100;
    
    results.push({
      timestamp: data[i].timestamp,
      value: williamsR
    });
  }
  
  return results;
}

// Commodity Channel Index
export function calculateCCI(data: OHLCData[], period: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    
    // Calculate typical prices
    const typicalPrices = slice.map(candle => (candle.high + candle.low + candle.close) / 3);
    
    // Calculate SMA of typical prices
    const sma = typicalPrices.reduce((acc, tp) => acc + tp, 0) / period;
    
    // Calculate mean deviation
    const meanDeviation = typicalPrices.reduce((acc, tp) => acc + Math.abs(tp - sma), 0) / period;
    
    // Calculate CCI
    const currentTypicalPrice = (data[i].high + data[i].low + data[i].close) / 3;
    const cci = (currentTypicalPrice - sma) / (0.015 * meanDeviation);
    
    results.push({
      timestamp: data[i].timestamp,
      value: cci
    });
  }
  
  return results;
}

// Helper function to get indicator calculation function
export function getIndicatorCalculator(indicatorId: string): ((data: OHLCData[], ...args: number[]) => IndicatorResult[]) | undefined {
  const calculators = {
    sma: calculateSMA,
    ema: calculateEMA,
    rsi: calculateRSI,
    bb: calculateBollingerBands,
    macd: calculateMACD,
    stoch: calculateStochastic,
    atr: calculateATR,
    williams_r: calculateWilliamsR,
    cci: calculateCCI,
  } as const;
  
  return calculators[indicatorId as keyof typeof calculators];
}

// Helper function to calculate indicator with parameters
export function calculateIndicator(
  indicatorId: string,
  data: OHLCData[],
  parameters: Record<string, number>
): IndicatorResult[] {
  const calculator = getIndicatorCalculator(indicatorId);
  
  if (!calculator) {
    console.warn(`Indicator calculator not found for: ${indicatorId}`);
    return [];
  }
  
  try {
    switch (indicatorId) {
      case 'sma':
      case 'ema':
      case 'rsi':
      case 'atr':
      case 'williams_r':
        return calculator(data, parameters.period || 14);
      
      case 'bb':
        return calculator(data, parameters.period || 20, parameters.stdDev || 2);
      
      case 'macd':
        return calculator(
          data,
          parameters.fastPeriod || 12,
          parameters.slowPeriod || 26,
          parameters.signalPeriod || 9
        );
      
      case 'stoch':
        return calculator(data, parameters.kPeriod || 14, parameters.dPeriod || 3);
      
      case 'cci':
        return calculator(data, parameters.period || 20);
      
      default:
        return calculator(data, parameters.period || 14);
    }
  } catch (error) {
    console.error(`Error calculating indicator ${indicatorId}:`, error);
    return [];
  }
} 