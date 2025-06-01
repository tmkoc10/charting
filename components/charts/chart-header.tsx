"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

import { ProfileDropdown } from "./profile-dropdown";
import { createClient } from "@/lib/client";
import { useTheme } from "@/lib/theme-context";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getIndicatorSourceCode } from "./indicator-legend";

// Define symbol search types
type SymbolData = {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
  category: string;
  securityId: string; // Keep track of the original security ID for internal use
};

// Database result types
type EquitySymbol = {
  SECURITY_ID: string;
  EXCHANGE_SEGMENT: string;
  DISPLAY_NAME: string;
};

type IndexSymbol = {
  SECURITY_ID: string;
  EXCHANGE_SEGMENT: string;
  DISPLAY_NAME: string;
};

type OptionSymbol = {
  SECURITY_ID: number;
  EXCHANGE_SEGMENT: string;
  DISPLAY_NAME: string;
};

// Function to convert display names to clean symbol names
function generateCleanSymbol(displayName: string, category: string): string {
  // Handle indices specially
  if (category === "Indices") {
    if (displayName.toLowerCase().includes("nifty 50")) return "NIFTY50";
    if (displayName.toLowerCase().includes("nifty bank")) return "BANKNIFTY";
    if (displayName.toLowerCase().includes("finnifty")) return "FINNIFTY";
    if (displayName.toLowerCase().includes("india vix")) return "INDIAVIX";
    if (displayName.toLowerCase().includes("nifty")) return "NIFTY";
  }

  // For equities, create full symbol names from company names
  // Remove corporate suffixes but keep the full company name
  const cleanName = displayName
    .replace(/\s+(Limited|Ltd|Corporation|Corp|Inc|Company|Co|Pvt)\b/gi, '') // Remove corporate suffixes
    .replace(/\s+(Mills|Industries|Motors|Power|Energy|Finance|Bank|Steel|Textiles|Chemicals|Pharmaceuticals|Technologies|Systems|Solutions|Services|Enterprises|Group)\b/gi, '') // Remove common business terms
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
    .toUpperCase();

  // Handle specific company patterns to create meaningful full names
  const lowerDisplayName = displayName.toLowerCase();

  // Reliance group companies
  if (lowerDisplayName.includes("reliance") && lowerDisplayName.includes("communication")) return "RELIANCECOMMUNICATIONS";
  if (lowerDisplayName.includes("reliance") && lowerDisplayName.includes("power")) return "RELIANCEPOWER";
  if (lowerDisplayName.includes("reliance") && lowerDisplayName.includes("capital")) return "RELIANCECAPITAL";
  if (lowerDisplayName.includes("reliance") && lowerDisplayName.includes("infrastructure")) return "RELIANCEINFRA";
  if (lowerDisplayName.includes("reliance") && lowerDisplayName.includes("industries")) return "RELIANCEINDUSTRIES";
  if (lowerDisplayName.includes("reliance")) return "RELIANCE";

  // TATA group companies
  if (lowerDisplayName.includes("tata") && lowerDisplayName.includes("steel")) return "TATASTEEL";
  if (lowerDisplayName.includes("tata") && lowerDisplayName.includes("motors")) return "TATAMOTORS";
  if (lowerDisplayName.includes("tata") && lowerDisplayName.includes("power")) return "TATAPOWER";
  if (lowerDisplayName.includes("tata") && lowerDisplayName.includes("consultancy")) return "TCS";
  if (lowerDisplayName.includes("tata") && lowerDisplayName.includes("consumer")) return "TATACONSUMER";
  if (lowerDisplayName.includes("tata")) return "TATA";

  // Other major companies with full names
  if (lowerDisplayName.includes("infosys")) return "INFOSYS";
  if (lowerDisplayName.includes("wipro")) return "WIPRO";
  if (lowerDisplayName.includes("hdfc") && lowerDisplayName.includes("bank")) return "HDFCBANK";
  if (lowerDisplayName.includes("hdfc") && lowerDisplayName.includes("life")) return "HDFCLIFE";
  if (lowerDisplayName.includes("hdfc")) return "HDFC";
  if (lowerDisplayName.includes("icici") && lowerDisplayName.includes("bank")) return "ICICIBANK";
  if (lowerDisplayName.includes("icici") && lowerDisplayName.includes("prudential")) return "ICICIPRU";
  if (lowerDisplayName.includes("icici")) return "ICICI";
  if (lowerDisplayName.includes("bharti") && lowerDisplayName.includes("airtel")) return "BHARTIAIRTEL";
  if (lowerDisplayName.includes("bharti")) return "BHARTI";
  if (lowerDisplayName.includes("maruti") && lowerDisplayName.includes("suzuki")) return "MARUTISUZUKI";
  if (lowerDisplayName.includes("maruti")) return "MARUTI";
  if (lowerDisplayName.includes("state bank")) return "SBI";
  if (lowerDisplayName.includes("larsen") && lowerDisplayName.includes("toubro")) return "LT";
  if (lowerDisplayName.includes("asian paints")) return "ASIANPAINTS";
  if (lowerDisplayName.includes("hindustan unilever")) return "HUL";
  if (lowerDisplayName.includes("itc")) return "ITC";
  if (lowerDisplayName.includes("kotak mahindra")) return "KOTAKBANK";
  if (lowerDisplayName.includes("mahindra") && lowerDisplayName.includes("mahindra")) return "MM";
  if (lowerDisplayName.includes("bajaj") && lowerDisplayName.includes("auto")) return "BAJAJAUTO";
  if (lowerDisplayName.includes("bajaj") && lowerDisplayName.includes("finance")) return "BAJAJFINANCE";
  if (lowerDisplayName.includes("bajaj")) return "BAJAJ";

  // If no specific pattern matches, use the cleaned full name (no length limit)
  return cleanName || displayName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

// Categories for filtering - updated to match actual data
const CATEGORIES = [
  "All", "Equity", "Indices", "Options"
];

// Timeframe data structure
const TIMEFRAMES = {
  TICKS: [
    { value: "1T", label: "1 tick" },
    { value: "5T", label: "5 ticks" },
    { value: "10T", label: "10 ticks" },
  ],
  SECONDS: [
    { value: "1S", label: "1 second" },
    { value: "5S", label: "5 seconds" },
    { value: "10S", label: "10 seconds" },
    { value: "30S", label: "30 seconds" },
  ],
  MINUTES: [
    { value: "1m", label: "1 minute" },
    { value: "2m", label: "2 minutes" },
    { value: "3m", label: "3 minutes" },
    { value: "5m", label: "5 minutes" },
    { value: "10m", label: "10 minutes" },
    { value: "15m", label: "15 minutes" },
    { value: "30m", label: "30 minutes" },
    { value: "45m", label: "45 minutes" },
  ],
  HOURS: [
    { value: "1H", label: "1 hour" },
    { value: "2H", label: "2 hours" },
    { value: "3H", label: "3 hours" },
    { value: "4H", label: "4 hours" },
  ],
  DAYS: [
    { value: "1D", label: "1 day" },
    { value: "1W", label: "1 week" },
    { value: "1M", label: "1 month" },
    { value: "3M", label: "3 months" },
  ],
};

// Chart type data structure
export type ChartType = 'candlestick' | 'line' | 'area' | 'bar' | 'baseline' | 'histogram';

const CHART_TYPES = [
  { label: "Candlesticks", value: "candlestick" as ChartType },
  { label: "Line Chart", value: "line" as ChartType },
  { label: "Area Chart", value: "area" as ChartType },
  { label: "Bar Chart", value: "bar" as ChartType },
  { label: "Baseline Chart", value: "baseline" as ChartType },
  { label: "Histogram", value: "histogram" as ChartType },
];

// Chart Type Icon Component
function ChartTypeIcon({ type, className = "", size = "default" }: { type: ChartType; className?: string; size?: "default" | "header" }) {
  const { theme } = useTheme();
  const iconColor = theme === 'dark' ? '#a1a1aa' : '#71717a';

  // Use standardized 24x24 size for header to match other header icons
  const iconSize = size === "header" ? "24" : "16";
  const strokeWidth = size === "header" ? "1.5" : "1";

  switch (type) {
    case 'candlestick':
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
        >
          {/* First candlestick - bullish (larger) */}
          <rect x="5" y="7" width="4" height="8" fill={iconColor} />
          <line x1="7" y1="4" x2="7" y2="7" stroke={iconColor} strokeWidth={strokeWidth} />
          <line x1="7" y1="15" x2="7" y2="20" stroke={iconColor} strokeWidth={strokeWidth} />

          {/* Second candlestick - bearish (smaller) */}
          <rect x="15" y="9" width="4" height="6" fill={iconColor} />
          <line x1="17" y1="6" x2="17" y2="9" stroke={iconColor} strokeWidth={strokeWidth} />
          <line x1="17" y1="15" x2="17" y2="18" stroke={iconColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'line':
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth={size === "header" ? "2.5" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polyline points="3,17 9,11 13,15 21,7" />
        </svg>
      );
    case 'area':
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
        >
          <path
            d="M3 17L9 11L13 15L21 7V21H3V17Z"
            fill={iconColor}
            fillOpacity="0.3"
          />
          <polyline
            points="3,17 9,11 13,15 21,7"
            stroke={iconColor}
            strokeWidth={size === "header" ? "2.5" : "2"}
            fill="none"
          />
        </svg>
      );
    case 'bar':
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
        >
          {/* Bar chart representation */}
          <line x1="6" y1="8" x2="6" y2="16" stroke={iconColor} strokeWidth={size === "header" ? "2.5" : "2"} />
          <line x1="5" y1="8" x2="7" y2="8" stroke={iconColor} strokeWidth={strokeWidth} />
          <line x1="5" y1="16" x2="7" y2="16" stroke={iconColor} strokeWidth={strokeWidth} />

          <line x1="12" y1="6" x2="12" y2="18" stroke={iconColor} strokeWidth={size === "header" ? "2.5" : "2"} />
          <line x1="11" y1="6" x2="13" y2="6" stroke={iconColor} strokeWidth={strokeWidth} />
          <line x1="11" y1="18" x2="13" y2="18" stroke={iconColor} strokeWidth={strokeWidth} />

          <line x1="18" y1="10" x2="18" y2="14" stroke={iconColor} strokeWidth={size === "header" ? "2.5" : "2"} />
          <line x1="17" y1="10" x2="19" y2="10" stroke={iconColor} strokeWidth={strokeWidth} />
          <line x1="17" y1="14" x2="19" y2="14" stroke={iconColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'baseline':
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
        >
          <line x1="3" y1="12" x2="21" y2="12" stroke={iconColor} strokeWidth={strokeWidth} strokeDasharray="2,2" />
          <path
            d="M3 12L9 8L13 10L21 6V12H3Z"
            fill={iconColor}
            fillOpacity="0.2"
          />
          <path
            d="M3 12L9 16L13 14L21 18V12H3Z"
            fill={iconColor}
            fillOpacity="0.1"
          />
          <polyline
            points="3,12 9,8 13,10 21,6"
            stroke={iconColor}
            strokeWidth={size === "header" ? "2.5" : "2"}
            fill="none"
          />
        </svg>
      );
    case 'histogram':
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
        >
          <rect x="4" y="12" width="2" height="8" fill={iconColor} />
          <rect x="8" y="8" width="2" height="12" fill={iconColor} />
          <rect x="12" y="14" width="2" height="6" fill={iconColor} />
          <rect x="16" y="10" width="2" height="10" fill={iconColor} />
          <rect x="20" y="16" width="2" height="4" fill={iconColor} />
        </svg>
      );
    default:
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
        >
          {/* First candlestick - bullish (larger) */}
          <rect x="5" y="7" width="4" height="8" fill={iconColor} />
          <line x1="7" y1="4" x2="7" y2="7" stroke={iconColor} strokeWidth={strokeWidth} />
          <line x1="7" y1="15" x2="7" y2="20" stroke={iconColor} strokeWidth={strokeWidth} />

          {/* Second candlestick - bearish (smaller) */}
          <rect x="15" y="9" width="4" height="6" fill={iconColor} />
          <line x1="17" y1="6" x2="17" y2="9" stroke={iconColor} strokeWidth={strokeWidth} />
          <line x1="17" y1="15" x2="17" y2="18" stroke={iconColor} strokeWidth={strokeWidth} />
        </svg>
      );
  }
}

// Indicators data structure
type IndicatorType = {
  id: string;
  name: string;
  description: string;
  category: 'trend' | 'momentum' | 'volatility' | 'support_resistance';
  parameters?: Record<string, number | string>;
};

const INDICATORS: Record<string, IndicatorType[]> = {
  Basic: [
    // Trend Following Indicators
    { id: "sma", name: "Simple Moving Average", description: "Average price over a specified period", category: "trend", parameters: { period: 20 } },
    { id: "ema", name: "Exponential Moving Average", description: "Exponentially weighted moving average", category: "trend", parameters: { period: 20 } },
    { id: "wma", name: "Weighted Moving Average", description: "Linearly weighted moving average", category: "trend", parameters: { period: 20 } },
    { id: "hma", name: "Hull Moving Average", description: "Fast and smooth moving average", category: "trend", parameters: { period: 20 } },
    { id: "tema", name: "Triple Exponential Moving Average", description: "Triple smoothed exponential moving average", category: "trend", parameters: { period: 20 } },
    { id: "dema", name: "Double Exponential Moving Average", description: "Double smoothed exponential moving average", category: "trend", parameters: { period: 20 } },
    { id: "kama", name: "Kaufman's Adaptive Moving Average", description: "Adaptive moving average based on market efficiency", category: "trend", parameters: { period: 20 } },
    { id: "alma", name: "Arnaud Legoux Moving Average", description: "Low-lag moving average with adjustable phase", category: "trend", parameters: { period: 20, offset: 0.85, sigma: 6 } },

    // Momentum Oscillators
    { id: "rsi", name: "Relative Strength Index", description: "Momentum oscillator measuring speed and change of price movements", category: "momentum", parameters: { period: 14 } },
    { id: "stoch", name: "Stochastic Oscillator", description: "Compares closing price to price range over time", category: "momentum", parameters: { kPeriod: 14, dPeriod: 3 } },
    { id: "williams_r", name: "Williams %R", description: "Momentum indicator showing overbought/oversold levels", category: "momentum", parameters: { period: 14 } },
    { id: "cci", name: "Commodity Channel Index", description: "Measures deviation from statistical mean", category: "momentum", parameters: { period: 20 } },
    { id: "roc", name: "Rate of Change", description: "Measures percentage change in price over time", category: "momentum", parameters: { period: 12 } },
    { id: "momentum", name: "Momentum", description: "Rate of acceleration of price change", category: "momentum", parameters: { period: 10 } },
    { id: "macd", name: "MACD", description: "Moving Average Convergence Divergence", category: "momentum", parameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 } },
    { id: "stoch_rsi", name: "Stochastic RSI", description: "Stochastic oscillator applied to RSI", category: "momentum", parameters: { rsiPeriod: 14, stochPeriod: 14 } },
    { id: "ultimate_osc", name: "Ultimate Oscillator", description: "Uses three timeframes to reduce false signals", category: "momentum", parameters: { short: 7, medium: 14, long: 28 } },
    { id: "awesome_osc", name: "Awesome Oscillator", description: "Difference between 34-period and 5-period simple moving averages", category: "momentum", parameters: { fastPeriod: 5, slowPeriod: 34 } },
    { id: "ppo", name: "Percentage Price Oscillator", description: "MACD in percentage form", category: "momentum", parameters: { fastPeriod: 12, slowPeriod: 26 } },

    // Volatility Indicators
    { id: "bb", name: "Bollinger Bands", description: "Price channels based on standard deviation", category: "volatility", parameters: { period: 20, stdDev: 2 } },
    { id: "atr", name: "Average True Range", description: "Measures market volatility", category: "volatility", parameters: { period: 14 } },
    { id: "keltner", name: "Keltner Channels", description: "Volatility-based envelopes", category: "volatility", parameters: { period: 20, multiplier: 2 } },
    { id: "donchian", name: "Donchian Channels", description: "Price channels based on highest high and lowest low", category: "volatility", parameters: { period: 20 } },
    { id: "stddev", name: "Standard Deviation", description: "Measures price volatility", category: "volatility", parameters: { period: 20 } },
    { id: "bb_width", name: "Bollinger Band Width", description: "Measures the width of Bollinger Bands", category: "volatility", parameters: { period: 20, stdDev: 2 } },
    { id: "bb_percent", name: "Bollinger %B", description: "Shows where price is relative to Bollinger Bands", category: "volatility", parameters: { period: 20, stdDev: 2 } },

    // Support/Resistance Indicators
    { id: "pivot", name: "Pivot Points", description: "Support and resistance levels", category: "support_resistance", parameters: { type: "standard" } },
    { id: "fibonacci", name: "Fibonacci Retracement", description: "Key retracement levels", category: "support_resistance", parameters: {} },
    { id: "sar", name: "Parabolic SAR", description: "Stop and reverse trend indicator", category: "support_resistance", parameters: { acceleration: 0.02, maximum: 0.2 } },
    { id: "zigzag", name: "ZigZag", description: "Filters out price movements below threshold", category: "support_resistance", parameters: { deviation: 5 } },
    { id: "support_resistance", name: "Support & Resistance", description: "Key price levels", category: "support_resistance", parameters: { period: 20 } },

    // Additional Popular Indicators
    { id: "adx", name: "Average Directional Index", description: "Measures trend strength", category: "trend", parameters: { period: 14 } },
    { id: "aroon", name: "Aroon", description: "Identifies trend changes", category: "trend", parameters: { period: 14 } },
    { id: "dpo", name: "Detrended Price Oscillator", description: "Removes trend to highlight cycles", category: "momentum", parameters: { period: 20 } },
    { id: "tsi", name: "True Strength Index", description: "Double-smoothed momentum oscillator", category: "momentum", parameters: { firstSmoothing: 25, secondSmoothing: 13 } },
    { id: "cmo", name: "Chande Momentum Oscillator", description: "Momentum oscillator with fixed boundaries", category: "momentum", parameters: { period: 14 } },
    { id: "mfi", name: "Money Flow Index", description: "Volume-weighted RSI", category: "momentum", parameters: { period: 14 } },
    { id: "obv", name: "On Balance Volume", description: "Cumulative volume indicator", category: "momentum", parameters: {} },
    { id: "ad_line", name: "Accumulation/Distribution Line", description: "Volume flow indicator", category: "momentum", parameters: {} },
    { id: "chaikin_osc", name: "Chaikin Oscillator", description: "MACD applied to A/D line", category: "momentum", parameters: { fastPeriod: 3, slowPeriod: 10 } },
    { id: "elder_ray", name: "Elder Ray Index", description: "Bull and bear power indicators", category: "momentum", parameters: { period: 13 } },
    { id: "price_channel", name: "Price Channel", description: "Highest high and lowest low channels", category: "support_resistance", parameters: { period: 20 } },
    { id: "linear_regression", name: "Linear Regression", description: "Statistical trend line", category: "trend", parameters: { period: 20 } },
    { id: "envelope", name: "Moving Average Envelope", description: "Percentage-based price channels", category: "volatility", parameters: { period: 20, percentage: 2.5 } },
    { id: "vwap", name: "Volume Weighted Average Price", description: "Average price weighted by volume", category: "trend", parameters: {} },
    { id: "ichimoku", name: "Ichimoku Cloud", description: "Comprehensive trend and momentum system", category: "trend", parameters: { tenkan: 9, kijun: 26, senkou: 52 } },
    { id: "supertrend", name: "SuperTrend", description: "Trend following indicator", category: "trend", parameters: { period: 10, multiplier: 3 } },
    { id: "vortex", name: "Vortex Indicator", description: "Identifies trend changes and strength", category: "trend", parameters: { period: 14 } },
    { id: "mass_index", name: "Mass Index", description: "Identifies trend reversals", category: "volatility", parameters: { period: 25 } },
    { id: "coppock", name: "Coppock Curve", description: "Long-term momentum indicator", category: "momentum", parameters: { roc1: 14, roc2: 11, wma: 10 } },
    { id: "know_sure_thing", name: "Know Sure Thing", description: "Momentum oscillator", category: "momentum", parameters: {} }
  ],
  Advanced: [
    { id: "custom_ma", name: "Custom Moving Average", description: "User-defined moving average", category: "trend", parameters: {} },
    { id: "adaptive_rsi", name: "Adaptive RSI", description: "RSI with adaptive periods", category: "momentum", parameters: {} },
    { id: "fractal_adaptive_ma", name: "Fractal Adaptive Moving Average", description: "FRAMA indicator", category: "trend", parameters: {} }
  ],
  Community: [
    { id: "community_indicator_1", name: "Community Indicator 1", description: "User-contributed indicator", category: "momentum", parameters: {} },
    { id: "community_indicator_2", name: "Community Indicator 2", description: "User-contributed indicator", category: "trend", parameters: {} }
  ],
};

// Custom hook to fetch symbols from Supabase
function useSymbolSearch() {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSymbols = useCallback(async (searchTerm: string = "", category: string = "All") => {
    // Only skip fetching if no search term AND "All" category is selected
    if (!searchTerm.trim() && category === "All") {
      setSymbols([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const results: SymbolData[] = [];

      // Helper function to map database results to SymbolData
      const mapEquityToSymbol = (equity: EquitySymbol): SymbolData => ({
        symbol: generateCleanSymbol(equity.DISPLAY_NAME, "Equity"),
        name: equity.DISPLAY_NAME,
        type: "Equity",
        exchange: equity.EXCHANGE_SEGMENT,
        category: "Equity",
        securityId: equity.SECURITY_ID
      });

      const mapIndexToSymbol = (index: IndexSymbol): SymbolData => ({
        symbol: generateCleanSymbol(index.DISPLAY_NAME, "Indices"),
        name: index.DISPLAY_NAME,
        type: "Index",
        exchange: index.EXCHANGE_SEGMENT,
        category: "Indices",
        securityId: index.SECURITY_ID
      });

      const mapOptionToSymbol = (option: OptionSymbol): SymbolData => ({
        symbol: generateCleanSymbol(option.DISPLAY_NAME, "Options"),
        name: option.DISPLAY_NAME,
        type: "Option",
        exchange: option.EXCHANGE_SEGMENT,
        category: "Options",
        securityId: option.SECURITY_ID.toString()
      });

      // Fetch from equity table
      if (category === "All" || category === "Equity") {
        try {
          let equityQuery = supabase
            .from('nse_equity_symbols')
            .select('SECURITY_ID, EXCHANGE_SEGMENT, DISPLAY_NAME');

          if (searchTerm.trim()) {
            equityQuery = equityQuery.or(`SECURITY_ID.ilike.%${searchTerm}%,DISPLAY_NAME.ilike.%${searchTerm}%`);
          } else {
            // If no search term but category is selected, get some popular symbols
            equityQuery = equityQuery.limit(20);
          }

          const { data: equityData, error: equityError } = await equityQuery.limit(50);

          if (equityError) {
            console.error('Equity query error:', equityError);
          } else if (equityData) {
            results.push(...equityData.map(mapEquityToSymbol));
          }
        } catch (equityError) {
          console.error('Equity query failed:', equityError);
        }
      }

      // Fetch from indices table
      if (category === "All" || category === "Indices") {
        try {
          let indicesQuery = supabase
            .from('nse_indices')
            .select('SECURITY_ID, EXCHANGE_SEGMENT, DISPLAY_NAME');

          if (searchTerm.trim()) {
            indicesQuery = indicesQuery.or(`SECURITY_ID.ilike.%${searchTerm}%,DISPLAY_NAME.ilike.%${searchTerm}%`);
          } else {
            // If no search term but category is selected, get all indices (they're limited)
            indicesQuery = indicesQuery.limit(20);
          }

          const { data: indicesData, error: indicesError } = await indicesQuery.limit(50);

          if (indicesError) {
            console.error('Indices query error:', indicesError);
          } else if (indicesData) {
            results.push(...indicesData.map(mapIndexToSymbol));
          }
        } catch (indicesError) {
          console.error('Indices query failed:', indicesError);
        }
      }

      // Fetch from options table
      if (category === "All" || category === "Options") {
        try {
          const optionsQuery = supabase
            .from('nse_options')
            .select('SECURITY_ID, EXCHANGE_SEGMENT, DISPLAY_NAME');

          if (searchTerm.trim()) {
            // Use separate queries for SECURITY_ID and DISPLAY_NAME to avoid casting issues
            const [securityIdResults, displayNameResults] = await Promise.all([
              supabase
                .from('nse_options')
                .select('SECURITY_ID, EXCHANGE_SEGMENT, DISPLAY_NAME')
                .eq('SECURITY_ID', parseInt(searchTerm) || -1)
                .limit(25),
              supabase
                .from('nse_options')
                .select('SECURITY_ID, EXCHANGE_SEGMENT, DISPLAY_NAME')
                .ilike('DISPLAY_NAME', `%${searchTerm}%`)
                .limit(25)
            ]);

            const combinedResults = [
              ...(securityIdResults.data || []),
              ...(displayNameResults.data || [])
            ];

            // Remove duplicates based on SECURITY_ID
            const uniqueResults = combinedResults.filter((item, index, self) =>
              index === self.findIndex(t => t.SECURITY_ID === item.SECURITY_ID)
            );

            if (securityIdResults.error) console.error('Options SECURITY_ID query error:', securityIdResults.error);
            if (displayNameResults.error) console.error('Options DISPLAY_NAME query error:', displayNameResults.error);

            if (uniqueResults.length > 0) {
              results.push(...uniqueResults.map(mapOptionToSymbol));
            }
          } else {
            // If no search term but category is selected, get some recent options
            const { data: optionsData, error: optionsError } = await optionsQuery.limit(20);

            if (optionsError) {
              console.error('Options query error:', optionsError);
            } else if (optionsData) {
              results.push(...optionsData.map(mapOptionToSymbol));
            }
          }
        } catch (optionsError) {
          console.error('Options query failed:', optionsError);
          // Don't throw here, just log and continue with other results
        }
      }

      // Sort results by relevance (exact matches first, then partial matches)
      const sortedResults = results.sort((a, b) => {
        const aExactSymbol = a.symbol.toLowerCase() === searchTerm.toLowerCase();
        const bExactSymbol = b.symbol.toLowerCase() === searchTerm.toLowerCase();
        const aExactName = a.name.toLowerCase() === searchTerm.toLowerCase();
        const bExactName = b.name.toLowerCase() === searchTerm.toLowerCase();

        if (aExactSymbol && !bExactSymbol) return -1;
        if (!aExactSymbol && bExactSymbol) return 1;
        if (aExactName && !bExactName) return -1;
        if (!aExactName && bExactName) return 1;

        return a.symbol.localeCompare(b.symbol);
      });

      setSymbols(sortedResults);
    } catch (err) {
      console.error('Error fetching symbols:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch symbols');
      setSymbols([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { symbols, loading, error, fetchSymbols };
}

// Default symbol for initial state
const DEFAULT_SYMBOL: SymbolData = {
  symbol: "NIFTY50",
  name: "Nifty 50",
  type: "Index",
  exchange: "NSE",
  category: "Indices",
  securityId: "13"
};

// Indicators Selector Component
function IndicatorsSelector({
  isOpen,
  onClose,
  onSelect,
  onOpenCodeEditor,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (indicator: IndicatorType) => void;
  onOpenCodeEditor?: (indicatorId: string) => void;
}) {
  const { theme } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("Basic");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIndicators, setFilteredIndicators] = useState<IndicatorType[]>(INDICATORS.Basic);
  const [isAnimating, setIsAnimating] = useState(false);


  // Filter indicators based on search term and category
  useEffect(() => {
    let filtered = INDICATORS[selectedCategory as keyof typeof INDICATORS];

    if (searchTerm.trim() !== "" && filtered.length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (indicator) =>
          indicator.name.toLowerCase().includes(lowerSearchTerm) ||
          indicator.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredIndicators(filtered);
  }, [searchTerm, selectedCategory]);

  // Focus input when popup opens with animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 150); // Delay focus until animation starts
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle click outside to close popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Portal to render at the body level to avoid z-index issues
  return (
    <>
      {createPortal(
        <div className={`fixed inset-0 z-50 flex items-start justify-center pt-20 transition-all duration-500 ease-out ${
          isAnimating
            ? (theme === 'dark'
                ? 'bg-black bg-opacity-80 backdrop-blur-sm'
                : 'bg-black bg-opacity-50 backdrop-blur-sm')
            : 'bg-opacity-0'
        }`}>
          <div
            ref={popupRef}
            className={`border-2 rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden transform transition-all duration-500 ease-out ${
              theme === 'dark'
                ? 'bg-black border-gray-700'
                : 'bg-white border-gray-300'
            } ${
              isAnimating
                ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{
              height: '580px', // Increased from 460px to 580px (120px more from bottom)
              boxShadow: theme === 'dark'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)'
            }}
          >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b border-opacity-50 ${
            theme === 'dark'
              ? 'border-gray-700'
              : 'border-gray-300'
          }`}>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Indicators</h2>
            <button
              onClick={onClose}
              className={`transition-all duration-300 p-2 rounded-lg hover:scale-110 active:scale-95 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Main Content Area with Sidebar */}
          <div className="flex flex-1" style={{ height: '500px' }}> {/* Increased from 380px to 500px */}
            {/* Left Sidebar - Categories */}
            <div className={`w-48 border-r border-opacity-50 ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-900 bg-opacity-30'
                : 'border-gray-300 bg-gray-100 bg-opacity-50'
            }`}>
              <div className={`p-3 border-b border-opacity-30 ${
                theme === 'dark'
                  ? 'border-gray-700'
                  : 'border-gray-300'
              }`}>
                <h3 className={`text-sm font-medium uppercase tracking-wide ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Categories</h3>
              </div>
              <div className="py-2">
                {Object.keys(INDICATORS).map((category, index) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-300 transform hover:translate-x-1 group ${
                      selectedCategory === category
                        ? (theme === 'dark'
                            ? "bg-gray-700 text-white shadow-lg border-r-2 border-r-gray-500"
                            : "bg-gray-300 text-black shadow-lg border-r-2 border-r-gray-600")
                        : (theme === 'dark'
                            ? "text-gray-400 hover:text-white hover:bg-gray-800 hover:bg-opacity-50"
                            : "text-gray-600 hover:text-black hover:bg-gray-200 hover:bg-opacity-70")
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`transition-all duration-300 ${
                        theme === 'dark' ? 'group-hover:text-gray-100' : 'group-hover:text-gray-800'
                      }`}>{category}</span>
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        selectedCategory === category
                          ? (theme === 'dark' ? "bg-gray-400" : "bg-gray-600")
                          : (theme === 'dark'
                              ? "bg-gray-600 group-hover:bg-gray-500"
                              : "bg-gray-400 group-hover:bg-gray-500")
                      }`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content Area - Indicators List */}
            <div className="flex-1 flex flex-col">
              {/* Search Input */}
              <div className={`px-4 py-3 border-b border-opacity-30 ${
                theme === 'dark'
                  ? 'border-gray-700'
                  : 'border-gray-300'
              }`}>
                <div className="relative group">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-500 group-focus-within:text-gray-300'
                      : 'text-gray-400 group-focus-within:text-gray-600'
                  }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search indicators..."
                    className={`w-full pl-9 pr-9 py-2.5 rounded-lg border border-opacity-40 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-900 bg-opacity-30 text-white border-gray-600 focus:ring-gray-500 focus:border-gray-500 focus:bg-gray-800 focus:bg-opacity-50 placeholder-gray-500 hover:border-gray-500'
                        : 'bg-gray-100 bg-opacity-50 text-black border-gray-300 focus:ring-gray-400 focus:border-gray-400 focus:bg-gray-50 placeholder-gray-400 hover:border-gray-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 p-1 rounded-lg hover:scale-110 active:scale-95 ${
                        theme === 'dark'
                          ? 'text-gray-500 hover:text-white hover:bg-gray-700'
                          : 'text-gray-400 hover:text-black hover:bg-gray-200'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Indicators List */}
              <div className="flex-1 overflow-y-auto scrollbar-black">
                {filteredIndicators.length > 0 ? (
                  <div>
                    {filteredIndicators.map((indicator, index) => (
                      <div
                        key={indicator.id}
                        onClick={() => {
                          onSelect(indicator);
                          onClose();
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelect(indicator);
                            onClose();
                          }
                        }}
                        className={`w-full px-4 py-3 text-left cursor-pointer border-b border-opacity-20 last:border-b-0 transition-all duration-300 transform hover:translate-x-1 hover:shadow-lg group ${
                          theme === 'dark'
                            ? 'hover:bg-gray-800 hover:bg-opacity-50 border-gray-700'
                            : 'hover:bg-gray-100 hover:bg-opacity-70 border-gray-300'
                        }`}
                        style={{
                          animationDelay: `${index * 30}ms`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <span className={`font-medium text-sm transition-all duration-300 truncate ${
                              theme === 'dark'
                                ? 'text-white group-hover:text-gray-100'
                                : 'text-black group-hover:text-gray-800'
                            }`}>
                              {searchTerm ? (
                                <HighlightText text={indicator.name} highlight={searchTerm} />
                              ) : (
                                indicator.name
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Close the indicators popup panel
                                onClose();
                                // Open the algo script footer drawer with the indicator's source code
                                if (onOpenCodeEditor) {
                                  onOpenCodeEditor(indicator.id);
                                }
                              }}
                              className={`text-xs font-mono transition-all duration-300 hover:scale-110 cursor-pointer ${
                                theme === 'dark'
                                  ? 'text-gray-600 hover:text-gray-400'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                              title="View Source Code"
                            >
                              {"{ }"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`p-8 text-center animate-pulse ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    <div className="text-lg mb-2 font-medium">No indicators found</div>
                    <div className="text-sm">Try adjusting your search or category filter</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>,
        document.body
      )}


    </>
  );
}



// Timeframe Selector Component
function TimeframeSelector({
  isOpen,
  onClose,
  onSelect,
  currentTimeframe,
  buttonRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (timeframe: string) => void;
  currentTimeframe: string;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { theme } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(["MINUTES"]);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      setIsAnimating(true);
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.bottom + 8, // 8px gap below the button
        left: buttonRect.left,
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, buttonRef]);

  // Handle click outside to close popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popupRef}
      className={`fixed border-2 rounded-xl shadow-2xl w-64 overflow-hidden transform transition-all duration-500 ease-out z-50 no-scrollbar ${
        theme === 'dark'
          ? 'bg-black border-gray-700'
          : 'bg-white border-gray-300'
      } ${
        isAnimating
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-2 opacity-0 scale-95'
      }`}
      style={{
        top: position.top,
        left: position.left,
        height: 'auto',
        maxHeight: '400px', // Keep max height but allow auto sizing
        boxShadow: theme === 'dark'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)'
      }}
    >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b border-opacity-50 ${
          theme === 'dark'
            ? 'border-gray-700'
            : 'border-gray-300'
        }`}>
          <h2 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>Timeframe</h2>
          <button
            onClick={onClose}
            className={`transition-all duration-300 p-2 rounded-lg hover:scale-110 active:scale-95 ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-black hover:bg-gray-200'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Timeframe List - Removed overflow and fixed height to prevent scrollbars */}
        <div className="flex-1 no-scrollbar" style={{ maxHeight: '340px', overflowY: 'auto' }}>
          {Object.entries(TIMEFRAMES).map(([sectionKey, timeframes], sectionIndex) => (
            <div key={sectionKey}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionKey)}
                className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wide transition-all duration-300 flex items-center justify-between border-b border-opacity-30 group ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-800 hover:bg-opacity-50 border-gray-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:bg-opacity-70 border-gray-300'
                }`}
                style={{
                  animationDelay: `${sectionIndex * 100}ms`
                }}
              >
                <span className={`transition-all duration-300 ${
                  theme === 'dark' ? 'group-hover:text-gray-300' : 'group-hover:text-gray-700'
                }`}>{sectionKey}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transform transition-all duration-300 group-hover:text-gray-300 ${
                    expandedSections.includes(sectionKey) ? 'rotate-180' : ''
                  }`}
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>

              {/* Section Items */}
              {expandedSections.includes(sectionKey) && (
                <div>
                  {timeframes.map((timeframe, index) => (
                    <button
                      key={timeframe.value}
                      onClick={() => {
                        onSelect(timeframe.value);
                        onClose();
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-all duration-300 border-b border-opacity-20 last:border-b-0 transform hover:translate-x-1 hover:shadow-lg group ${
                        theme === 'dark'
                          ? 'border-gray-700'
                          : 'border-gray-300'
                      } ${
                        currentTimeframe === timeframe.value
                          ? (theme === 'dark'
                              ? "bg-gray-700 text-white font-medium shadow-lg border-l-2 border-l-gray-500"
                              : "bg-gray-200 text-black font-medium shadow-lg border-l-2 border-l-gray-600")
                          : (theme === 'dark'
                              ? "text-gray-300 hover:bg-gray-800 hover:bg-opacity-70 hover:text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:bg-opacity-70 hover:text-black")
                      }`}
                      style={{
                        animationDelay: `${(sectionIndex * timeframes.length + index) * 50}ms`
                      }}
                    >
                      <span className={`transition-all duration-300 ${
                        theme === 'dark' ? 'group-hover:text-gray-100' : 'group-hover:text-gray-800'
                      }`}>
                        {timeframe.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
    </div>,
    document.body
  );
}

// Chart Type Selector Component
function ChartTypeSelector({
  isOpen,
  onClose,
  onSelect,
  currentChartType,
  buttonRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (chartType: ChartType) => void;
  currentChartType: ChartType;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { theme } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      setIsAnimating(true);
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.bottom + 8, // 8px gap below the button
        left: buttonRect.left,
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, buttonRef]);

  // Handle click outside to close popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popupRef}
      className={`fixed border-2 rounded-xl shadow-2xl w-64 overflow-hidden transform transition-all duration-500 ease-out z-50 no-scrollbar ${
        theme === 'dark'
          ? 'bg-black border-gray-700'
          : 'bg-white border-gray-300'
      } ${
        isAnimating
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-2 opacity-0 scale-95'
      }`}
      style={{
        top: position.top,
        left: position.left,
        height: 'auto', // Auto height to fit all content
        maxHeight: 'none', // Remove max height restriction
        boxShadow: theme === 'dark'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)'
      }}
    >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b border-opacity-50 ${
          theme === 'dark'
            ? 'border-gray-700'
            : 'border-gray-300'
        }`}>
          <h2 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>Chart Type</h2>
          <button
            onClick={onClose}
            className={`transition-all duration-300 p-2 rounded-lg hover:scale-110 active:scale-95 ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-black hover:bg-gray-200'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Chart Type List - Removed overflow and fixed height to prevent scrollbars */}
        <div className="flex-1">
          {CHART_TYPES.map((chartType, index) => (
            <button
              key={chartType.value}
              onClick={() => {
                onSelect(chartType.value);
                onClose();
              }}
              className={`w-full px-4 py-3 text-left text-sm transition-all duration-300 border-b border-opacity-20 last:border-b-0 transform hover:translate-x-1 hover:shadow-lg group ${
                theme === 'dark'
                  ? 'border-gray-700'
                  : 'border-gray-300'
              } ${
                currentChartType === chartType.value
                  ? (theme === 'dark'
                      ? "bg-gray-700 text-white font-medium shadow-lg border-l-2 border-l-gray-500"
                      : "bg-gray-200 text-black font-medium shadow-lg border-l-2 border-l-gray-600")
                  : (theme === 'dark'
                      ? "text-gray-300 hover:bg-gray-800 hover:bg-opacity-70 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:bg-opacity-70 hover:text-black")
              }`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="flex items-center gap-3">
                <ChartTypeIcon type={chartType.value} className="flex-shrink-0" />
                <span className={`transition-all duration-300 ${
                  theme === 'dark' ? 'group-hover:text-gray-100' : 'group-hover:text-gray-800'
                }`}>
                  {chartType.label}
                </span>
              </div>
            </button>
          ))}
        </div>
    </div>,
    document.body
  );
}

// Symbol Search Popup Component
function SymbolSearchPopup({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (symbol: SymbolData) => void;
}) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAnimating, setIsAnimating] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { symbols, loading, error, fetchSymbols } = useSymbolSearch();

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSymbols(searchTerm, selectedCategory);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, fetchSymbols]);

  // Focus input when popup opens with animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 150); // Delay focus until animation starts
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle click outside to close popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Portal to render at the body level to avoid z-index issues
  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-20 transition-all duration-500 ease-out ${
      isAnimating
        ? (theme === 'dark'
            ? 'bg-black bg-opacity-80 backdrop-blur-sm'
            : 'bg-black bg-opacity-50 backdrop-blur-sm')
        : 'bg-opacity-0'
    }`}>
      <div
        ref={popupRef}
        className={`border-2 rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden transform transition-all duration-500 ease-out ${
          theme === 'dark'
            ? 'bg-black border-gray-700'
            : 'bg-white border-gray-300'
        } ${
          isAnimating
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-95'
        }`}
        style={{
          height: '480px',
          boxShadow: theme === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b border-opacity-50 ${
          theme === 'dark'
            ? 'border-gray-700'
            : 'border-gray-300'
        }`}>
          <h2 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>Symbol Search</h2>
          <button
            onClick={onClose}
            className={`transition-all duration-300 p-2 rounded-lg hover:scale-110 active:scale-95 ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-black hover:bg-gray-200'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className={`px-4 py-3 border-b border-opacity-50 ${
          theme === 'dark'
            ? 'border-gray-700'
            : 'border-gray-300'
        }`}>
          <div className="relative group">
            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              theme === 'dark'
                ? 'text-gray-500 group-focus-within:text-gray-300'
                : 'text-gray-400 group-focus-within:text-gray-600'
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search symbols..."
              className={`w-full pl-10 pr-10 py-3 rounded-xl border border-opacity-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-sm ${
                theme === 'dark'
                  ? 'bg-gray-900 bg-opacity-50 text-white border-gray-600 focus:ring-gray-500 focus:border-gray-500 focus:bg-gray-800 placeholder-gray-500 hover:border-gray-500'
                  : 'bg-gray-100 bg-opacity-50 text-black border-gray-300 focus:ring-gray-400 focus:border-gray-400 focus:bg-gray-50 placeholder-gray-400 hover:border-gray-400'
              }`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 p-1 rounded-lg hover:scale-110 active:scale-95 ${
                  theme === 'dark'
                    ? 'text-gray-500 hover:text-white hover:bg-gray-700'
                    : 'text-gray-400 hover:text-black hover:bg-gray-200'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className={`px-4 py-3 border-b border-opacity-50 ${
          theme === 'dark'
            ? 'border-gray-700'
            : 'border-gray-300'
        }`}>
          <div className="flex flex-wrap gap-2 justify-between">
            {CATEGORIES.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 text-center transform hover:scale-105 active:scale-95 border ${
                  selectedCategory === category
                    ? (theme === 'dark'
                        ? "bg-gray-700 text-white shadow-lg border-gray-600"
                        : "bg-gray-300 text-black shadow-lg border-gray-400")
                    : (theme === 'dark'
                        ? "bg-gray-800 bg-opacity-50 text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700 border-opacity-50 hover:border-gray-600"
                        : "bg-gray-100 bg-opacity-50 text-gray-700 hover:text-black hover:bg-gray-200 border-gray-300 border-opacity-50 hover:border-gray-400")
                }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Symbol List */}
        <div className="flex-1 overflow-y-auto scrollbar-black" style={{ height: '320px' }}>
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-4"></div>
              <div className="text-lg mb-2 font-medium">Searching symbols...</div>
              <div className="text-sm">Please wait while we fetch the results</div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              <div className="text-lg mb-2 font-medium">Error loading symbols</div>
              <div className="text-sm">{error}</div>
              <button
                onClick={() => fetchSymbols(searchTerm, selectedCategory)}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : symbols.length > 0 ? (
            <div>
              {symbols.map((item, index) => (
                <div
                  key={`${item.symbol}-${item.exchange}-${index}`}
                  onClick={() => onSelect(item)}
                  className={`px-4 py-3 cursor-pointer flex justify-between items-center border-b border-opacity-30 last:border-b-0 transition-all duration-300 transform hover:translate-x-1 hover:shadow-lg group ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 hover:bg-opacity-70 border-gray-700'
                      : 'hover:bg-gray-100 hover:bg-opacity-70 border-gray-300'
                  }`}
                  style={{
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {/* Symbol Icon */}
                    <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-300 group-hover:scale-110 ${getSymbolIconStyle(item.category)}`}>
                      {getSymbolIcon(item)}
                    </div>

                    {/* Symbol Info - Only Symbol Name */}
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className={`font-semibold text-sm transition-all duration-300 ${
                          theme === 'dark'
                            ? 'text-white group-hover:text-gray-100'
                            : 'text-black group-hover:text-gray-800'
                        }`}>
                          {searchTerm ? (
                            <HighlightText text={item.symbol} highlight={searchTerm} />
                          ) : (
                            item.symbol
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.trim() || selectedCategory !== "All" ? (
            <div className={`p-8 text-center animate-pulse ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              <div className="text-lg mb-2 font-medium">No symbols found</div>
              <div className="text-sm">Try adjusting your search or category filter</div>
            </div>
          ) : (
            <div className={`p-8 text-center ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              <div className="text-lg mb-2 font-medium">Start typing to search</div>
              <div className="text-sm">Enter a symbol name or select a category to begin</div>
            </div>
          )}
        </div>

        <div className={`px-4 py-3 border-t border-opacity-50 text-xs text-center ${
          theme === 'dark'
            ? 'border-gray-700 text-gray-500'
            : 'border-gray-300 text-gray-600'
        }`}>
          Simply start typing while on the chart to pull up this search box
        </div>
      </div>
    </div>,
    document.body
  );
}

// Helper functions for symbol icons and styling
function getSymbolIcon(symbol: SymbolData): string {
  if (symbol.symbol.includes("NIFTY") || symbol.symbol.includes("CNX")) {
    return "50";
  }
  if (symbol.category === "Indices") {
    return "📊";
  }
  if (symbol.category === "Equity") {
    return symbol.symbol.charAt(0);
  }
  if (symbol.category === "Options") {
    return "⚡";
  }
  if (symbol.category === "Futures") {
    return "📈";
  }
  if (symbol.category === "Stocks") {
    return symbol.symbol.charAt(0);
  }
  if (symbol.category === "Crypto") {
    return "₿";
  }
  if (symbol.category === "Forex") {
    return "$";
  }
  if (symbol.category === "Funds") {
    return "📊";
  }
  if (symbol.category === "Bonds") {
    return "🏛️";
  }
  return symbol.symbol.charAt(0);
}

function getSymbolIconStyle(category: string): string {
  switch (category) {
    case "Indices":
      return "bg-blue-700 text-blue-200 border border-blue-600";
    case "Equity":
      return "bg-green-700 text-green-200 border border-green-600";
    case "Options":
      return "bg-purple-700 text-purple-200 border border-purple-600";
    case "Futures":
      return "bg-gray-900 text-gray-300 border border-gray-700";
    case "Stocks":
      return "bg-gray-600 text-gray-100 border border-gray-500";
    case "Crypto":
      return "bg-gray-800 text-gray-200 border border-gray-600";
    case "Forex":
      return "bg-gray-700 text-gray-200 border border-gray-600";
    case "Funds":
      return "bg-gray-900 text-gray-300 border border-gray-700";
    case "Bonds":
      return "bg-gray-600 text-gray-100 border border-gray-500";
    default:
      return "bg-gray-800 text-gray-300 border border-gray-600";
  }
}

// Helper functions for indicator categories
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'trend':
      return 'Trend';
    case 'momentum':
      return 'Momentum';
    case 'volatility':
      return 'Volatility';
    case 'support_resistance':
      return 'S/R';
    default:
      return 'Other';
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCategoryBadgeStyle(category: string): string {
  switch (category) {
    case 'trend':
      return 'bg-blue-900 bg-opacity-50 text-blue-300 border border-blue-700 border-opacity-50';
    case 'momentum':
      return 'bg-green-900 bg-opacity-50 text-green-300 border border-green-700 border-opacity-50';
    case 'volatility':
      return 'bg-orange-900 bg-opacity-50 text-orange-300 border border-orange-700 border-opacity-50';
    case 'support_resistance':
      return 'bg-purple-900 bg-opacity-50 text-purple-300 border border-purple-700 border-opacity-50';
    default:
      return 'bg-gray-900 bg-opacity-50 text-gray-300 border border-gray-700 border-opacity-50';
  }
}

// Helper component to highlight search matches
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  const { theme } = useTheme();

  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className={`px-1.5 py-0.5 rounded-md font-semibold shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-100'
              : 'bg-gray-300 text-gray-800'
          }`}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// Export Panel Component
interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

function ExportPanel({ isOpen, onClose, onExport, buttonRef }: ExportPanelProps) {
  const { theme } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      setIsAnimating(true);
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.bottom + 8, // 8px gap below the button
        left: buttonRect.right - 320, // Align right edge of panel with button (320px is panel width)
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, buttonRef]);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      const panel = popupRef.current;
      const button = buttonRef.current;

      if (panel && !panel.contains(target) && button && !button.contains(target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popupRef}
      className={`fixed border-2 rounded-xl shadow-2xl w-80 overflow-hidden transform transition-all duration-500 ease-out z-50 no-scrollbar ${
        theme === 'dark'
          ? 'bg-black border-gray-700'
          : 'bg-white border-gray-300'
      } ${
        isAnimating
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-2 opacity-0 scale-95'
      }`}
      style={{
        top: position.top,
        left: position.left,
        height: 'auto',
        maxHeight: '400px',
        boxShadow: theme === 'dark'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-opacity-50 ${
        theme === 'dark'
          ? 'border-gray-700'
          : 'border-gray-300'
      }`}>
        <h2 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}>Export chart data</h2>
        <button
          onClick={onClose}
          className={`transition-all duration-300 p-2 rounded-lg hover:scale-110 active:scale-95 ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-black hover:bg-gray-200'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className={`text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
          All information from the selected chart, including the symbol & indicators will be saved to a CSV file.
        </p>

        <div className="space-y-3">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              Chart
            </label>
            <select className={`w-full px-3 py-2 rounded border text-sm ${
              theme === 'dark'
                ? 'bg-zinc-800 border-zinc-700 text-white'
                : 'bg-white border-zinc-300 text-black'
            }`}>
              <option>NSE:NIFTY, 1</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              Time format (UTC)
            </label>
            <select className={`w-full px-3 py-2 rounded border text-sm ${
              theme === 'dark'
                ? 'bg-zinc-800 border-zinc-700 text-white'
                : 'bg-white border-zinc-300 text-black'
            }`}>
              <option>UNIX timestamp</option>
              <option>ISO 8601</option>
              <option>Human readable</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-700 hover:text-black hover:bg-zinc-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => onExport('csv')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-black text-white hover:bg-zinc-800'
            }`}
          >
            Export
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

type ChartHeaderProps = {
  onSymbolChange?: (symbol: string) => void;
  onTimeframeChange?: (timeframe: string) => void;
  onChartTypeChange?: (chartType: ChartType) => void;
  onIndicatorAdd?: (indicator: IndicatorType) => void;
  onIndicatorOpenCodeEditor?: (indicatorId: string) => void;
  isCodeEditorActive?: boolean;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
};

export function ChartHeader({ onSymbolChange, onTimeframeChange, onChartTypeChange, onIndicatorAdd, onIndicatorOpenCodeEditor, isCodeEditorActive, isFullscreen, onFullscreenToggle }: ChartHeaderProps) {
  const { theme } = useTheme();
  const [currentSymbol, setCurrentSymbol] = useState<SymbolData>(DEFAULT_SYMBOL);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState("1m");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [currentChartType, setCurrentChartType] = useState<ChartType>("candlestick");
  const [isChartTypeOpen, setIsChartTypeOpen] = useState(false);
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const timeframeButtonRef = useRef<HTMLButtonElement>(null);
  const chartTypeButtonRef = useRef<HTMLButtonElement>(null);
  const indicatorsButtonRef = useRef<HTMLButtonElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  // Screenshot functionality
  const handleScreenshot = useCallback(async () => {
    if (isCapturingScreenshot) return; // Prevent multiple simultaneous captures

    setIsCapturingScreenshot(true);

    try {
      // Method 1: Try Screen Capture API (modern browsers)
      if ('getDisplayMedia' in navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              width: { ideal: window.screen.width },
              height: { ideal: window.screen.height }
            }
          });

          // Create video element to capture frame
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();

          video.addEventListener('loadedmetadata', () => {
            // Create canvas to capture frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
              ctx.drawImage(video, 0, 0);

              // Convert to blob and download
              canvas.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `chart-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }, 'image/png');
            }

            // Stop the stream
            stream.getTracks().forEach(track => track.stop());
            setIsCapturingScreenshot(false);
          });

          return;
        } catch (screenCaptureError) {
          console.warn('Screen Capture API failed, trying alternative method:', screenCaptureError);
        }
      }

      // Method 2: Try html2canvas as fallback
      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(document.body, {
        height: window.innerHeight,
        width: window.innerWidth,
        useCORS: true,
        allowTaint: true
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `chart-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

    } catch (error) {
      console.error('Screenshot failed:', error);

      // Method 3: Fallback notification for manual screenshot
      if (window.confirm('Automatic screenshot failed. Would you like instructions for taking a manual screenshot?')) {
        const instructions = `
Manual Screenshot Instructions:
• Windows: Press Windows + Shift + S, then select area
• Mac: Press Cmd + Shift + 4, then select area
• Chrome: Press Ctrl/Cmd + Shift + I, then Ctrl/Cmd + Shift + P, type "screenshot"
• Firefox: Right-click → "Take Screenshot"
        `;
        alert(instructions);
      }
    } finally {
      setIsCapturingScreenshot(false);
    }
  }, [isCapturingScreenshot]);

  // Export functionality
  const handleExport = useCallback((format: string) => {
    console.log(`Exporting chart data as ${format}`);
    // TODO: Implement actual export functionality
    setIsExportOpen(false);
  }, []);

  const handleSymbolSelect = (symbol: SymbolData) => {
    setCurrentSymbol(symbol);
    setIsSearchOpen(false);
    // Notify parent component of symbol change
    onSymbolChange?.(symbol.symbol);
    console.log("Selected symbol:", symbol);
  };

  const handleTimeframeSelect = (timeframe: string) => {
    setCurrentTimeframe(timeframe);
    setIsTimeframeOpen(false);
    // Notify parent component of timeframe change
    onTimeframeChange?.(timeframe);
    console.log("Selected timeframe:", timeframe);
  };

  const handleChartTypeSelect = (chartType: ChartType) => {
    setCurrentChartType(chartType);
    setIsChartTypeOpen(false);
    // Notify parent component of chart type change
    onChartTypeChange?.(chartType);
    console.log("Selected chart type:", chartType);
  };

  const handleIndicatorSelect = (indicator: IndicatorType) => {
    setIsIndicatorsOpen(false);
    // Notify parent component of indicator addition
    onIndicatorAdd?.(indicator);
    console.log("Selected indicator:", indicator);
  };

  // Handle keyboard shortcut to open search
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't open search if code editor is active
      if (isCodeEditorActive) {
        return;
      }

      // Don't open search if user is typing in an input, textarea, or code editor
      const target = event.target as HTMLElement;

      // More comprehensive check for input elements
      const isInInput = target.tagName === 'INPUT' ||
                       target.tagName === 'TEXTAREA' ||
                       target.contentEditable === 'true' ||
                       target.isContentEditable ||
                       target.closest('.cm-editor') || // CodeMirror editor
                       target.closest('.cm-content') || // CodeMirror content area
                       target.closest('.cm-line') || // CodeMirror line
                       target.closest('[role="textbox"]') ||
                       target.closest('.code-editor') ||
                       target.closest('[data-editor="true"]');

      // Open search when user starts typing (letters/numbers only) but not in input fields
      if (!isSearchOpen &&
          !isInInput &&
          /^[a-zA-Z0-9]$/.test(event.key) &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey) {
        setIsSearchOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, isCodeEditorActive]);

  return (
    <header className={`h-[38px] flex items-stretch px-0 ${
      theme === 'dark'
        ? 'bg-black border-b border-zinc-800'
        : 'bg-white border-b border-zinc-300'
    }`}>
      {/* Left sidebar profile section - aligned with left sidebar width (52px) */}
      <div className="w-[52px] flex items-center justify-center">
        <ProfileDropdown />
      </div>

      {/* Main header content */}
      <div className="flex-1 flex items-center">
        {/* Header buttons container with hover reveal behavior */}
        <div className="flex items-center">
          {/* Symbol Search section - square shaped button */}
          <div className="h-full flex items-center">
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center justify-between gap-1.5 px-2 py-1 transition-all duration-300 rounded-md text-sm min-w-[140px] max-w-[180px] ${
                theme === 'dark'
                  ? 'text-white hover:bg-zinc-900'
                  : 'text-black hover:bg-zinc-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span className="font-medium tracking-wide truncate">{currentSymbol.symbol}</span>
              </div>
              {/* Invisible spacer to maintain button width */}
              <div className="w-4 flex-shrink-0"></div>
            </motion.button>
          </div>

          {/* Vertical Separator Line */}
          <div className="flex items-center px-3">
            <div className={`w-px h-5 ${theme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-400'}`}></div>
          </div>

          {/* Timeframe Selector */}
          <div className="h-full flex items-center">
            <motion.button
              ref={timeframeButtonRef}
              onClick={() => setIsTimeframeOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-md text-sm ${
                theme === 'dark'
                  ? 'text-white hover:bg-zinc-900'
                  : 'text-black hover:bg-zinc-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <span className="font-medium">{currentTimeframe}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}
            >
              <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </motion.button>
          </div>

          {/* Vertical Separator Line */}
          <div className="flex items-center px-3">
            <div className={`w-px h-5 ${theme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-400'}`}></div>
          </div>

          {/* Chart Type Selector */}
          <div className="h-full flex items-center">
            <motion.button
              ref={chartTypeButtonRef}
              onClick={() => setIsChartTypeOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-md text-sm ${
                theme === 'dark'
                  ? 'text-white hover:bg-zinc-900'
                  : 'text-black hover:bg-zinc-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <ChartTypeIcon type={currentChartType} size="header" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}
            >
              <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </motion.button>
          </div>

          {/* Vertical Separator Line */}
          <div className="flex items-center px-3">
            <div className={`w-px h-5 ${theme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-400'}`}></div>
          </div>

          {/* Indicators Button */}
          <div className="h-full flex items-center">
            <motion.button
              ref={indicatorsButtonRef}
              onClick={() => setIsIndicatorsOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-md text-sm ${
                theme === 'dark'
                  ? 'text-white hover:bg-zinc-900'
                  : 'text-black hover:bg-zinc-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}
            >
              <path d="M3 3v18h18"></path>
              <path d="M7 12l3-3 3 3 5-5"></path>
            </svg>
              <span className="font-medium">Indicators</span>
            </motion.button>
          </div>

          {/* Vertical Separator Line */}
          <div className="flex items-center px-3">
            <div className={`w-px h-5 ${theme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-400'}`}></div>
          </div>

          {/* Replay Button */}
          <div className="h-full flex items-center">
            <motion.button
              onClick={() => {
                // TODO: Add replay functionality
                console.log('Replay clicked');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-md text-sm ${
                theme === 'dark'
                  ? 'text-white hover:bg-zinc-900'
                  : 'text-black hover:bg-zinc-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Replay"
            >
              {/* Two connected rewind/replay icons */}
              <div className="flex items-center -space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}
                >
                  <polygon points="13,7 13,17 6,12"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}
                >
                  <polygon points="13,7 13,17 6,12"></polygon>
                </svg>
              </div>
              <span className="font-medium">Replay</span>
            </motion.button>
          </div>
        </div>

        {/* Empty space */}
        <div className="flex-1"></div>
      </div>

      {/* Right section with export, screen, settings, screenshot, fullscreen and logout buttons */}
      <div className="flex items-center gap-1 pr-2">
        {/* Export Button */}
        <motion.button
          ref={exportButtonRef}
          onClick={() => setIsExportOpen(true)}
          className={`p-2 transition-all duration-300 rounded ${
            theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'
              : 'text-zinc-600 hover:text-zinc-700 hover:bg-zinc-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Export"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7,10 12,15 17,10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </motion.button>

        {/* Screen/Monitor Button */}
        <motion.button
          onClick={() => {
            // TODO: Add screen/monitor functionality
            console.log('Screen clicked');
          }}
          className={`p-2 transition-all duration-300 rounded ${
            theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'
              : 'text-zinc-600 hover:text-zinc-700 hover:bg-zinc-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Screen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </motion.button>

        {/* Settings Button */}
        <motion.button
          onClick={() => {
            // TODO: Add settings functionality
            console.log('Settings clicked');
          }}
          className={`p-2 transition-all duration-300 rounded ${
            theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'
              : 'text-zinc-600 hover:text-zinc-700 hover:bg-zinc-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </motion.button>

        {/* Screenshot Button */}
        <motion.button
          onClick={handleScreenshot}
          disabled={isCapturingScreenshot}
          className={`p-2 transition-all duration-300 rounded ${
            isCapturingScreenshot
              ? theme === 'dark'
                ? 'text-zinc-500 bg-zinc-800 cursor-not-allowed'
                : 'text-zinc-400 bg-zinc-200 cursor-not-allowed'
              : theme === 'dark'
                ? 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'
                : 'text-zinc-600 hover:text-zinc-700 hover:bg-zinc-200'
          }`}
          whileHover={!isCapturingScreenshot ? { scale: 1.05 } : {}}
          whileTap={!isCapturingScreenshot ? { scale: 0.95 } : {}}
          title={isCapturingScreenshot ? "Taking Screenshot..." : "Take Screenshot"}
        >
          {isCapturingScreenshot ? (
            // Loading spinner
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56"></path>
            </svg>
          ) : (
            // Camera icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
          )}
        </motion.button>

        {/* Fullscreen Toggle Button */}
        <motion.button
          onClick={onFullscreenToggle}
          className={`p-2 transition-all duration-300 rounded ${
            theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'
              : 'text-zinc-600 hover:text-zinc-700 hover:bg-zinc-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isFullscreen ? (
              // Minimize/Exit fullscreen icon
              <>
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </>
            ) : (
              // Maximize/Enter fullscreen icon
              <>
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
              </>
            )}
          </svg>
        </motion.button>

        {/* Logout Button */}
        <button
          onClick={() => window.location.href = '/'}
          className={`p-2 transition-colors duration-200 rounded ${
            theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-200'
          }`}
          title="Exit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300'
              : 'text-zinc-600 hover:text-zinc-700'
            }
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16,17 21,12 16,7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Symbol Search Popup */}
      <SymbolSearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSymbolSelect}
      />

      {/* Timeframe Selector Popup */}
      <TimeframeSelector
        isOpen={isTimeframeOpen}
        onClose={() => setIsTimeframeOpen(false)}
        onSelect={handleTimeframeSelect}
        currentTimeframe={currentTimeframe}
        buttonRef={timeframeButtonRef}
      />

      {/* Chart Type Selector Popup */}
      <ChartTypeSelector
        isOpen={isChartTypeOpen}
        onClose={() => setIsChartTypeOpen(false)}
        onSelect={handleChartTypeSelect}
        currentChartType={currentChartType}
        buttonRef={chartTypeButtonRef}
      />

      {/* Indicators Selector Popup */}
      <IndicatorsSelector
        isOpen={isIndicatorsOpen}
        onClose={() => setIsIndicatorsOpen(false)}
        onSelect={handleIndicatorSelect}
        onOpenCodeEditor={onIndicatorOpenCodeEditor}
      />

      {/* Export Options Panel */}
      <ExportPanel
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
        buttonRef={exportButtonRef}
      />
    </header>
  );
}
