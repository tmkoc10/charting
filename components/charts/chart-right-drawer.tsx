"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";

interface ChartRightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  isAnimationPaused?: boolean;
}

export function ChartRightDrawer({ isOpen, onClose, activeTab, isAnimationPaused = false }: ChartRightDrawerProps) {
  const { theme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case "watchlist":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Watchlist
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-white text-zinc-400 hover:text-white' 
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Track your favorite symbols and monitor market movements in real-time.</p>
              <div className="space-y-2">
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">NIFTY 50</div>
                    <div className="text-green-500 text-xs">+0.85%</div>
                  </div>
                  <div className="text-xs opacity-70">24,542.50 • NSE</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">BANKNIFTY</div>
                    <div className="text-red-500 text-xs">-0.42%</div>
                  </div>
                  <div className="text-xs opacity-70">51,234.75 • NSE</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">RELIANCE</div>
                    <div className="text-green-500 text-xs">+1.23%</div>
                  </div>
                  <div className="text-xs opacity-70">2,845.60 • NSE</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "clock":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Alerts & Notifications
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-white text-zinc-400 hover:text-white' 
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Set up price alerts and notifications for your trading strategy.</p>
              <div className="space-y-2">
                <div className={`p-3 rounded border ${
                  theme === 'dark' 
                    ? 'border-zinc-700 bg-zinc-800/50' 
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium">NIFTY &gt; 19,500</div>
                  <div className="text-xs opacity-70">Price alert • Active</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark' 
                    ? 'border-zinc-700 bg-zinc-800/50' 
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium">RSI Overbought</div>
                  <div className="text-xs opacity-70">Technical alert • Triggered</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "layers":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Layers & Stack
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-white text-zinc-400 hover:text-white' 
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Manage chart layers, overlays, and drawing tools.</p>
              <div className="space-y-2">
                <div className={`p-3 rounded border ${
                  theme === 'dark' 
                    ? 'border-zinc-700 bg-zinc-800/50' 
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium">Support/Resistance Lines</div>
                  <div className="text-xs opacity-70">Drawing layer • Visible</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark' 
                    ? 'border-zinc-700 bg-zinc-800/50' 
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium">Fibonacci Retracement</div>
                  <div className="text-xs opacity-70">Analysis layer • Hidden</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "chat":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Chat & Messages
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-white text-zinc-400 hover:text-white' 
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Connect with other traders and share market insights.</p>
              <div className="space-y-2">
                <div className={`p-3 rounded border ${
                  theme === 'dark' 
                    ? 'border-zinc-700 bg-zinc-800/50' 
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium">Trading Room #1</div>
                  <div className="text-xs opacity-70">12 members online</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark' 
                    ? 'border-zinc-700 bg-zinc-800/50' 
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium">Market Analysis</div>
                  <div className="text-xs opacity-70">8 members online</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "ai":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                AI Assistant
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-white text-zinc-400 hover:text-white'
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Get intelligent market analysis, trading insights, and personalized recommendations.</p>
              <div className="space-y-3">
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">Market Analysis</div>
                  <div className="text-xs opacity-70">AI-powered technical analysis and pattern recognition for current chart.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">Trading Signals</div>
                  <div className="text-xs opacity-70">Real-time buy/sell signals based on machine learning algorithms.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">Risk Assessment</div>
                  <div className="text-xs opacity-70">Intelligent risk analysis and position sizing recommendations.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">Chat Assistant</div>
                  <div className="text-xs opacity-70">Ask questions about market trends, strategies, and technical indicators.</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "api":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                API
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-white text-zinc-400 hover:text-white'
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Access trading APIs, manage API keys, and integrate with external services.</p>
              <div className="space-y-3">
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">API Keys</div>
                  <div className="text-xs opacity-70">Manage your trading API keys and authentication tokens.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">REST API</div>
                  <div className="text-xs opacity-70">Access market data, place orders, and manage positions via REST endpoints.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">WebSocket API</div>
                  <div className="text-xs opacity-70">Real-time market data streaming and order updates.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">API Documentation</div>
                  <div className="text-xs opacity-70">Complete API reference, examples, and integration guides.</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "faq":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                FAQ & Help
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-white text-zinc-400 hover:text-white'
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Get help with charting features and trading tools.</p>
              <div className="space-y-3">
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">How to add indicators?</div>
                  <div className="text-xs opacity-70">Click the Indicators button in the header and select from available options.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">How to change timeframes?</div>
                  <div className="text-xs opacity-70">Use the Timeframe dropdown in the header to switch between different time intervals.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">How to search symbols?</div>
                  <div className="text-xs opacity-70">Click the Symbol Search button and type the stock symbol you want to analyze.</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">How to set alerts?</div>
                  <div className="text-xs opacity-70">Use the Alerts panel to create price and technical indicator notifications.</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Notifications & Alerts
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-white text-zinc-400 hover:text-white'
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Stay updated with real-time trading alerts, price notifications, and market updates.</p>
              <div className="space-y-3">
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">Price Alert</div>
                    <div className="text-xs opacity-70">2 min ago</div>
                  </div>
                  <div className="text-xs opacity-70">AAPL reached $175.00 target price</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">Volume Spike</div>
                    <div className="text-xs opacity-70">5 min ago</div>
                  </div>
                  <div className="text-xs opacity-70">TSLA volume increased by 300%</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">Technical Signal</div>
                    <div className="text-xs opacity-70">10 min ago</div>
                  </div>
                  <div className="text-xs opacity-70">SPY RSI crossed above 70 (Overbought)</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">Market News</div>
                    <div className="text-xs opacity-70">15 min ago</div>
                  </div>
                  <div className="text-xs opacity-70">Fed announces interest rate decision</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "calendar":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Calendar & Scheduling
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-white text-zinc-400 hover:text-white'
                    : 'hover:bg-black text-zinc-600 hover:text-black'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p className="mb-4">Schedule trading sessions, set market event reminders, and track important dates.</p>
              <div className="space-y-3">
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">Today&apos;s Market Events</div>
                  <div className="text-xs opacity-70">Fed Interest Rate Decision - 2:00 PM EST</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">Upcoming Earnings</div>
                  <div className="text-xs opacity-70">AAPL Earnings Report - Tomorrow 4:30 PM EST</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">Trading Session</div>
                  <div className="text-xs opacity-70">Market Analysis - Friday 9:00 AM EST</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark'
                    ? 'border-zinc-700 bg-zinc-800/50'
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium mb-1">Economic Calendar</div>
                  <div className="text-xs opacity-70">GDP Report Release - Next Monday</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Select a tool to get started
            </h3>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`h-full ${
      theme === 'dark' ? 'text-white' : 'text-black'
    }`}>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: isAnimationPaused ? 0 : 0.15,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        className="h-full overflow-y-auto pt-3"
        style={{
          willChange: isAnimationPaused ? 'auto' : 'transform, opacity'
        }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}
