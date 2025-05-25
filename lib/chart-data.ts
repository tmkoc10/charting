// Chart data types
export type CandlestickData = {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// Seeded random number generator for deterministic data
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Generate realistic OHLCV data for different timeframes
function generateRealisticData(timeframe: string = "1m", seed: number = 12345): CandlestickData[] {
  const data: CandlestickData[] = [];
  
  // Starting date: May 1, 2025, 9:00 AM UTC
  const startDate = new Date('2025-05-01T09:00:00Z');
  let currentPrice = 23450; // Starting price for NIFTY
  
  // Create seeded random generator for deterministic results
  const rng = new SeededRandom(seed); // Use provided seed for consistency
  
  // Determine interval in minutes based on timeframe
  const getIntervalMinutes = (tf: string): number => {
    if (tf.includes('T')) return 0.01; // Ticks (very small interval)
    if (tf.includes('S')) return parseFloat(tf.replace('S', '')) / 60; // Seconds to minutes
    if (tf.includes('m')) return parseFloat(tf.replace('m', '')); // Minutes
    if (tf.includes('H')) return parseFloat(tf.replace('H', '')) * 60; // Hours to minutes
    if (tf.includes('D')) return parseFloat(tf.replace('D', '')) * 24 * 60; // Days to minutes
    if (tf.includes('W')) return parseFloat(tf.replace('W', '')) * 7 * 24 * 60; // Weeks to minutes
    if (tf.includes('M')) return parseFloat(tf.replace('M', '')) * 30 * 24 * 60; // Months to minutes
    return 1; // Default to 1 minute
  };
  
  const intervalMinutes = getIntervalMinutes(timeframe);
  const totalMinutes = 5 * 12 * 60; // 5 days × 12 hours × 60 minutes
  const totalCandles = Math.floor(totalMinutes / intervalMinutes);
  
  // Adjust volatility based on timeframe (smaller timeframes = smaller moves)
  const getVolatility = (tf: string): number => {
    if (tf.includes('T') || tf.includes('S')) return 0.0001; // Very small for ticks/seconds
    if (tf.includes('m')) return 0.0005; // Small for minutes
    if (tf.includes('H')) return 0.002; // Medium for hours
    if (tf.includes('D')) return 0.01; // Larger for days
    return 0.0005; // Default
  };
  
  const volatility = getVolatility(timeframe);
  
  for (let i = 0; i < totalCandles; i++) {
    const timestamp = new Date(startDate);
    timestamp.setMinutes(startDate.getMinutes() + (i * intervalMinutes));
    
    // Skip weekends for daily+ timeframes
    if (intervalMinutes >= 1440 && (timestamp.getDay() === 0 || timestamp.getDay() === 6)) {
      continue;
    }
    
    // Generate realistic price movement
    const trend = Math.sin(i * 0.01) * 0.0001; // Very slight trend component
    const randomChange = (rng.next() - 0.5) * volatility;
    
    // Calculate OHLC based on current price
    const priceChange = (trend + randomChange) * currentPrice;
    const open = currentPrice;
    
    // Generate high and low with realistic spreads (smaller for shorter timeframes)
    const spreadMultiplier = Math.min(1, intervalMinutes / 60); // Smaller spreads for shorter timeframes
    const highSpread = rng.next() * 0.002 * currentPrice * spreadMultiplier;
    const lowSpread = rng.next() * 0.002 * currentPrice * spreadMultiplier;
    
    const high = Math.max(open, open + priceChange) + highSpread;
    const low = Math.min(open, open + priceChange) - lowSpread;
    const close = open + priceChange;
    
    // Ensure OHLC relationships are maintained
    const finalHigh = Math.max(open, high, low, close);
    const finalLow = Math.min(open, high, low, close);
    
    // Generate volume (adjust based on timeframe)
    const baseVolume = intervalMinutes >= 60 ? 1000000 : 50000; // Lower volume for shorter timeframes
    const volumeVariation = rng.next() * 0.5 + 0.75; // 75% to 125% of base
    
    // Time of day multiplier (higher volume during market hours)
    const hour = timestamp.getHours();
    const timeOfDayMultiplier = hour < 11 || hour > 19 ? 0.6 : 1.2; // Lower volume at start/end
    
    const volume = Math.floor(baseVolume * volumeVariation * timeOfDayMultiplier);
    
    data.push({
      time: timestamp.getTime(),
      open: Math.round(open * 100) / 100,
      high: Math.round(finalHigh * 100) / 100,
      low: Math.round(finalLow * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: volume
    });
    
    // Update current price for next candle
    currentPrice = close;
    
    // Add overnight gaps for daily+ timeframes
    if (intervalMinutes >= 1440 && i % (1440 / intervalMinutes) === 0 && i > 0) {
      const overnightChange = (rng.next() - 0.5) * 0.01; // Up to 1% overnight change
      currentPrice = currentPrice * (1 + overnightChange);
    }
  }
  
  return data;
}

// Cache for generated data to avoid regenerating on every call
const dataCache: Record<string, CandlestickData[]> = {};

// Generate data for a specific symbol and timeframe
function generateSymbolData(symbol: string, timeframe: string): CandlestickData[] {
  const cacheKey = `${symbol}_${timeframe}`;
  
  if (dataCache[cacheKey]) {
    return dataCache[cacheKey];
  }
  
  // Create a unique seed based on symbol and timeframe for deterministic but varied data
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 
               timeframe.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const baseData = generateRealisticData(timeframe, seed);
  let symbolData: CandlestickData[];
  
  switch (symbol) {
    case 'BANKNIFTY':
      symbolData = baseData.map(candle => ({
        ...candle,
        open: candle.open * 2.1,
        high: candle.high * 2.1,
        low: candle.low * 2.1,
        close: candle.close * 2.1,
        volume: Math.floor(candle.volume * 0.6)
      }));
      break;
      
    case 'AAPL':
      symbolData = baseData.map(candle => ({
        ...candle,
        open: candle.open * 0.008,
        high: candle.high * 0.008,
        low: candle.low * 0.008,
        close: candle.close * 0.008,
        volume: Math.floor(candle.volume * 2.5)
      }));
      break;
      
    case 'BTC':
      symbolData = baseData.map(candle => ({
        ...candle,
        open: candle.open * 2.8,
        high: candle.high * 2.8,
        low: candle.low * 2.8,
        close: candle.close * 2.8,
        volume: Math.floor(candle.volume * 0.1)
      }));
      break;
      
    case 'EURUSD':
      symbolData = baseData.map(candle => ({
        ...candle,
        open: 1.0850 + (candle.open - 23450) * 0.000001,
        high: 1.0850 + (candle.high - 23450) * 0.000001,
        low: 1.0850 + (candle.low - 23450) * 0.000001,
        close: 1.0850 + (candle.close - 23450) * 0.000001,
        volume: Math.floor(candle.volume * 0.3)
      }));
      break;
      
    default: // NIFTY and others
      symbolData = baseData;
      break;
  }
  
  dataCache[cacheKey] = symbolData;
  return symbolData;
}

// Function to get chart data for a specific symbol and timeframe
export function getChartData(symbol: string, timeframe: string = "1H"): CandlestickData[] {
  return generateSymbolData(symbol, timeframe);
}

// Function to format price based on symbol type
export function formatPrice(price: number, symbol: string): string {
  if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP')) {
    return price.toFixed(5); // Forex pairs - 5 decimal places
  } else if (symbol === 'BTC' || symbol === 'ETH') {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (symbol === 'AAPL' || symbol === 'MSFT' || symbol === 'GOOGL') {
    return price.toFixed(2); // US stocks - 2 decimal places
  } else {
    return price.toFixed(2); // Indian indices - 2 decimal places
  }
}

// Function to format volume
export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'K';
  } else {
    return volume.toString();
  }
}

// Function to get latest price for a symbol
export function getLatestPrice(symbol: string, timeframe: string = "1H"): number {
  const data = getChartData(symbol, timeframe);
  return data.length > 0 ? data[data.length - 1].close : 0;
}

// Function to calculate price change
export function getPriceChange(symbol: string, timeframe: string = "1H"): { change: number; changePercent: number } {
  const data = getChartData(symbol, timeframe);
  if (data.length < 2) return { change: 0, changePercent: 0 };
  
  const latest = data[data.length - 1].close;
  const previous = data[data.length - 2].close;
  const change = latest - previous;
  const changePercent = (change / previous) * 100;
  
  return { change, changePercent };
} 