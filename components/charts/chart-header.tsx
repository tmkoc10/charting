"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { getLatestPrice, getPriceChange, formatPrice } from "@/lib/chart-data";
import { UserAccountDropdown } from "./user-account-dropdown";

// Define symbol search types
type SymbolData = {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
  category: string;
};

// Categories for filtering
const CATEGORIES = [
  "All", "Stocks", "Funds", "Futures", "Forex", "Crypto", "Indices", "Bonds", "Economy", "Options"
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

// Mock data for demonstration - in a real app, this would come from an API
const MOCK_SYMBOLS: SymbolData[] = [
  // Indian Indices
  { symbol: "NIFTY", name: "NIFTY 50 INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "NIFTY", name: "GIFT NIFTY 50 INDEX FUTURES", type: "Futures", exchange: "NSEIX", category: "Futures" },
  { symbol: "NIFTY", name: "S&P CNX NIFTY INDEX FUTURES", type: "Futures", exchange: "NSE", category: "Futures" },
  { symbol: "BANKNIFTY", name: "NIFTY BANK INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "CNXFINANCE", name: "NIFTY FINANCIAL SERVICES INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "NIFTY_MID_SELECT", name: "NIFTY MIDCAP SELECT INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "CNXIT", name: "NIFTY IT INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "CNX500", name: "NIFTY 500 INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "CNXSMALLCAP", name: "NIFTY SMALLCAP 100 INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "CNXAUTO", name: "NIFTY AUTO INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "CNXFMCG", name: "NIFTY FMCG INDEX", type: "Index", exchange: "NSE", category: "Indices" },
  { symbol: "CNXPHARMA", name: "NIFTY PHARMA INDEX", type: "Index", exchange: "NSE", category: "Indices" },

  // US Stocks
  { symbol: "AAPL", name: "Apple Inc", type: "Stock", exchange: "NASDAQ", category: "Stocks" },
  { symbol: "MSFT", name: "Microsoft Corporation", type: "Stock", exchange: "NASDAQ", category: "Stocks" },
  { symbol: "GOOGL", name: "Alphabet Inc", type: "Stock", exchange: "NASDAQ", category: "Stocks" },
  { symbol: "AMZN", name: "Amazon.com Inc", type: "Stock", exchange: "NASDAQ", category: "Stocks" },
  { symbol: "TSLA", name: "Tesla Inc", type: "Stock", exchange: "NASDAQ", category: "Stocks" },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "Stock", exchange: "NASDAQ", category: "Stocks" },
  { symbol: "META", name: "Meta Platforms Inc", type: "Stock", exchange: "NASDAQ", category: "Stocks" },

  // Crypto
  { symbol: "BTC", name: "Bitcoin", type: "Crypto", exchange: "CRYPTO", category: "Crypto" },
  { symbol: "ETH", name: "Ethereum", type: "Crypto", exchange: "CRYPTO", category: "Crypto" },
  { symbol: "XRP", name: "Ripple", type: "Crypto", exchange: "CRYPTO", category: "Crypto" },

  // Forex
  { symbol: "EURUSD", name: "Euro / US Dollar", type: "Currency", exchange: "FOREX", category: "Forex" },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", type: "Currency", exchange: "FOREX", category: "Forex" },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", type: "Currency", exchange: "FOREX", category: "Forex" },

  // Funds
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", type: "ETF", exchange: "NYSE", category: "Funds" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", type: "ETF", exchange: "NASDAQ", category: "Funds" },

  // Bonds
  { symbol: "TLT", name: "iShares 20+ Year Treasury Bond ETF", type: "Bond ETF", exchange: "NASDAQ", category: "Bonds" },
  { symbol: "IEF", name: "iShares 7-10 Year Treasury Bond ETF", type: "Bond ETF", exchange: "NASDAQ", category: "Bonds" }
];

// Indicators Selector Component
function IndicatorsSelector({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (indicator: IndicatorType) => void;
}) {
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
  return createPortal(
    <div className={`fixed inset-0 bg-black z-50 flex items-start justify-center pt-20 transition-all duration-500 ease-out ${
      isAnimating ? 'bg-opacity-80 backdrop-blur-sm' : 'bg-opacity-0'
    }`}>
      <div
        ref={popupRef}
        className={`bg-black border-2 border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden transform transition-all duration-500 ease-out ${
          isAnimating 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-95'
        }`}
        style={{
          height: '580px', // Increased from 460px to 580px (120px more from bottom)
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3)'
        }}
      >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 border-opacity-50">
        <h2 className="text-lg font-semibold text-white">Indicators</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-gray-800 hover:scale-110 active:scale-95"
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
        <div className="w-48 border-r border-gray-700 border-opacity-50 bg-gray-900 bg-opacity-30">
          <div className="p-3 border-b border-gray-700 border-opacity-30">
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Categories</h3>
          </div>
          <div className="py-2">
            {Object.keys(INDICATORS).map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-300 transform hover:translate-x-1 group ${
                  selectedCategory === category
                    ? "bg-gray-700 text-white shadow-lg border-r-2 border-r-gray-500"
                    : "text-gray-400 hover:text-white hover:bg-gray-800 hover:bg-opacity-50"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="transition-all duration-300 group-hover:text-gray-100">{category}</span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category 
                      ? "bg-gray-400" 
                      : "bg-gray-600 group-hover:bg-gray-500"
                  }`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area - Indicators List */}
        <div className="flex-1 flex flex-col">
          {/* Search Input */}
          <div className="px-4 py-3 border-b border-gray-700 border-opacity-30">
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:text-gray-300">
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
                  className="text-gray-500"
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
                className="w-full bg-gray-900 bg-opacity-30 text-white pl-9 pr-9 py-2.5 rounded-lg border border-gray-600 border-opacity-40 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:border-gray-500 focus:bg-gray-800 focus:bg-opacity-50 transition-all duration-300 text-sm placeholder-gray-500 hover:border-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-all duration-300 p-1 rounded-lg hover:bg-gray-700 hover:scale-110 active:scale-95"
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
                  <button
                    key={indicator.id}
                    onClick={() => {
                      onSelect(indicator);
                      onClose();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 hover:bg-opacity-50 cursor-pointer border-b border-gray-700 border-opacity-20 last:border-b-0 transition-all duration-300 transform hover:translate-x-1 hover:shadow-lg group"
                    style={{
                      animationDelay: `${index * 30}ms`
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm transition-all duration-300 group-hover:text-gray-100 truncate">
                            {searchTerm ? (
                              <HighlightText text={indicator.name} highlight={searchTerm} />
                            ) : (
                              indicator.name
                            )}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-300 ${getCategoryBadgeStyle(indicator.category)}`}>
                            {getCategoryDisplayName(indicator.category)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 transition-all duration-300 group-hover:text-gray-300 line-clamp-2">
                          {searchTerm ? (
                            <HighlightText text={indicator.description} highlight={searchTerm} />
                          ) : (
                            indicator.description
                          )}
                        </p>
                        {indicator.parameters && Object.keys(indicator.parameters).length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-500">Default:</span>
                            <span className="text-xs text-gray-400 font-mono">
                              {Object.entries(indicator.parameters).map(([key, value]) => `${key}=${value}`).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 transition-all duration-300 group-hover:bg-gray-500"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 animate-pulse">
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
      className={`fixed bg-black border-2 border-gray-700 rounded-xl shadow-2xl w-64 overflow-hidden transform transition-all duration-500 ease-out z-50 ${
        isAnimating 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-2 opacity-0 scale-95'
      }`}
      style={{
        top: position.top,
        left: position.left,
        height: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3)'
      }}
    >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 border-opacity-50">
          <h2 className="text-lg font-semibold text-white">Timeframe</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-gray-800 hover:scale-110 active:scale-95"
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

        {/* Timeframe List */}
        <div className="flex-1 overflow-y-auto scrollbar-black" style={{ height: '340px' }}>
          {Object.entries(TIMEFRAMES).map(([sectionKey, timeframes], sectionIndex) => (
            <div key={sectionKey}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionKey)}
                className="w-full px-4 py-3 text-left text-gray-400 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-between border-b border-gray-700 border-opacity-30 group"
                style={{
                  animationDelay: `${sectionIndex * 100}ms`
                }}
              >
                <span className="transition-all duration-300 group-hover:text-gray-300">{sectionKey}</span>
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
                      className={`w-full px-4 py-3 text-left text-sm transition-all duration-300 border-b border-gray-700 border-opacity-20 last:border-b-0 transform hover:translate-x-1 hover:shadow-lg group ${
                        currentTimeframe === timeframe.value
                          ? "bg-gray-700 text-white font-medium shadow-lg border-l-2 border-l-gray-500"
                          : "text-gray-300 hover:bg-gray-800 hover:bg-opacity-70 hover:text-white"
                      }`}
                      style={{
                        animationDelay: `${(sectionIndex * timeframes.length + index) * 50}ms`
                      }}
                    >
                      <span className="transition-all duration-300 group-hover:text-gray-100">
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredSymbols, setFilteredSymbols] = useState<SymbolData[]>(MOCK_SYMBOLS);
  const [isAnimating, setIsAnimating] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter symbols based on search term and category
  useEffect(() => {
    let filtered = MOCK_SYMBOLS;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(symbol => symbol.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (symbol) =>
          symbol.symbol.toLowerCase().includes(lowerSearchTerm) ||
          symbol.name.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredSymbols(filtered);
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
  return createPortal(
    <div className={`fixed inset-0 bg-black z-50 flex items-start justify-center pt-20 transition-all duration-500 ease-out ${
      isAnimating ? 'bg-opacity-80 backdrop-blur-sm' : 'bg-opacity-0'
    }`}>
      <div
        ref={popupRef}
        className={`bg-black border-2 border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden transform transition-all duration-500 ease-out ${
          isAnimating 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-95'
        }`}
        style={{
          height: '480px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 border-opacity-50">
          <h2 className="text-lg font-semibold text-white">Symbol Search</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-gray-800 hover:scale-110 active:scale-95"
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
        <div className="px-4 py-3 border-b border-gray-700 border-opacity-50">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:text-gray-300">
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
                className="text-gray-500"
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
              className="w-full bg-gray-900 bg-opacity-50 text-white pl-10 pr-10 py-3 rounded-xl border border-gray-600 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:border-gray-500 focus:bg-gray-800 transition-all duration-300 text-sm placeholder-gray-500 hover:border-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-all duration-300 p-1 rounded-lg hover:bg-gray-700 hover:scale-110 active:scale-95"
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
        <div className="px-4 py-3 border-b border-gray-700 border-opacity-50">
          <div className="flex flex-wrap gap-2 justify-between">
            {CATEGORIES.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 text-center transform hover:scale-105 active:scale-95 ${
                  selectedCategory === category
                    ? "bg-gray-700 text-white shadow-lg border border-gray-600"
                    : "bg-gray-800 bg-opacity-50 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700 border-opacity-50 hover:border-gray-600"
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
          {filteredSymbols.length > 0 ? (
            <div>
              {filteredSymbols.map((item, index) => (
                <div
                  key={`${item.symbol}-${item.exchange}-${index}`}
                  onClick={() => onSelect(item)}
                  className="px-4 py-3 hover:bg-gray-800 hover:bg-opacity-70 cursor-pointer flex justify-between items-center border-b border-gray-700 border-opacity-30 last:border-b-0 transition-all duration-300 transform hover:translate-x-1 hover:shadow-lg group"
                  style={{
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {/* Symbol Icon */}
                    <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-300 group-hover:scale-110 ${getSymbolIconStyle(item.category)}`}>
                      {getSymbolIcon(item)}
                    </div>

                    {/* Symbol Info */}
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white text-sm transition-all duration-300 group-hover:text-gray-100">
                          {searchTerm ? (
                            <HighlightText text={item.symbol} highlight={searchTerm} />
                          ) : (
                            item.symbol
                          )}
                        </span>
                        <span className="text-gray-400 font-medium text-sm transition-all duration-300 group-hover:text-gray-300">
                          {searchTerm ? (
                            <HighlightText text={item.name} highlight={searchTerm} />
                          ) : (
                            item.name
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Exchange and Type Info */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-gray-500 font-medium transition-all duration-300 group-hover:text-gray-400">{item.type}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400 transition-all duration-300 group-hover:text-gray-300">{item.exchange}</span>
                      <div className="w-2 h-2 rounded-full bg-gray-600 flex items-center justify-center transition-all duration-300 group-hover:bg-gray-500">
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 animate-pulse">
              <div className="text-lg mb-2 font-medium">No symbols found</div>
              <div className="text-sm">Try adjusting your search or category filter</div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-700 border-opacity-50 text-xs text-gray-500 text-center">
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
      return "bg-gray-700 text-gray-200 border border-gray-600";
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
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-gray-700 text-gray-100 px-1.5 py-0.5 rounded-md font-semibold shadow-sm">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

type ChartHeaderProps = {
  onSymbolChange?: (symbol: string) => void;
  onTimeframeChange?: (timeframe: string) => void;
  onIndicatorAdd?: (indicator: IndicatorType) => void;
};

export function ChartHeader({ onSymbolChange, onTimeframeChange, onIndicatorAdd }: ChartHeaderProps) {
  const [currentSymbol, setCurrentSymbol] = useState<SymbolData>(MOCK_SYMBOLS[0]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState("1m");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const timeframeButtonRef = useRef<HTMLButtonElement>(null);
  const indicatorsButtonRef = useRef<HTMLButtonElement>(null);

  // Ensure client-side rendering for price data to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
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

  const handleIndicatorSelect = (indicator: IndicatorType) => {
    setIsIndicatorsOpen(false);
    // Notify parent component of indicator addition
    onIndicatorAdd?.(indicator);
    console.log("Selected indicator:", indicator);
  };

  // Handle keyboard shortcut to open search
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Open search when user starts typing (letters/numbers only)
      if (!isSearchOpen && /^[a-zA-Z0-9]$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
        setIsSearchOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  return (
    <header className="h-[38px] bg-black border-b border-zinc-800 flex items-stretch px-0">
      {/* Left sidebar profile section - aligned with left sidebar width (52px) */}
      <div className="w-[52px] flex items-center justify-center">
        <UserAccountDropdown />
      </div>

      {/* Main header content */}
      <div className="flex-1 flex items-center">
        {/* Symbol Search section - capsule shaped button */}
        <div className="h-full flex items-center">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white transition-colors duration-200 rounded-full text-sm"
          >
            <div className="flex items-center gap-2">
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
                className="text-zinc-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="font-medium tracking-wide">{currentSymbol.symbol}</span>
            </div>
            
            {/* Price and Change Display */}
            {isClient && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-white">
                  {formatPrice(getLatestPrice(currentSymbol.symbol, currentTimeframe), currentSymbol.symbol)}
                </span>
                <span className={`font-medium px-1.5 py-0.5 rounded ${
                  getPriceChange(currentSymbol.symbol, currentTimeframe).change >= 0 
                    ? 'text-green-400 bg-green-900 bg-opacity-30' 
                    : 'text-red-400 bg-red-900 bg-opacity-30'
                }`}>
                  {getPriceChange(currentSymbol.symbol, currentTimeframe).change >= 0 ? '+' : ''}
                  {getPriceChange(currentSymbol.symbol, currentTimeframe).changePercent.toFixed(2)}%
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Vertical Separator Line */}
        <div className="flex items-center px-3">
          <div className="w-px h-5 bg-zinc-600"></div>
        </div>

        {/* Timeframe Selector */}
        <div className="h-full flex items-center">
          <button
            ref={timeframeButtonRef}
            onClick={() => setIsTimeframeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white transition-colors duration-200 rounded-full text-sm"
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
              className="text-zinc-400"
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
        </div>

        {/* Vertical Separator Line */}
        <div className="flex items-center px-3">
          <div className="w-px h-5 bg-zinc-600"></div>
        </div>

        {/* Indicators Button */}
        <div className="h-full flex items-center">
          <button
            ref={indicatorsButtonRef}
            onClick={() => setIsIndicatorsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white transition-colors duration-200 rounded-full text-sm"
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
              className="text-zinc-400"
            >
              <path d="M3 3v18h18"></path>
              <path d="M7 12l3-3 3 3 5-5"></path>
            </svg>
            <span className="font-medium">Indicators</span>
          </button>
        </div>

        {/* Empty space */}
        <div className="flex-1"></div>
      </div>

      {/* Right sidebar exit button section - aligned with right sidebar width (52px) */}
      <div className="w-[52px] flex items-center justify-center">
        <button
          onClick={() => window.location.href = '/'}
          className="p-2 hover:bg-zinc-800 transition-colors duration-200 rounded"
          title="Exit"
        >
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
            className="text-zinc-400 hover:text-zinc-300"
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

      {/* Indicators Selector Popup */}
      <IndicatorsSelector
        isOpen={isIndicatorsOpen}
        onClose={() => setIsIndicatorsOpen(false)}
        onSelect={handleIndicatorSelect}
      />
    </header>
  );
}
