"use client";

import { useState } from "react";
import { ChevronDown, Info, TrendingUp, BarChart3, TrendingDown } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { TabType, ChartToggleState, ViewMode } from "./types";
import { mockStrategyResults } from "./mockData";
import { MetricsCards } from "./MetricsCards";
import { TabNavigation } from "./TabNavigation";
// import { StrategyChart } from "./StrategyChart";
import { TradesList } from "./TradesList";

export function StrategyTester() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isDeepBacktesting, setIsDeepBacktesting] = useState(true);
  const [chartToggles, setChartToggles] = useState<ChartToggleState>({
    equity: true,
    drawdown: true,
    buyHold: false
  });
  const [viewMode, setViewMode] = useState<ViewMode>('absolute');

  // Debug logging
  console.log('StrategyTester rendered', { activeTab, mockStrategyResults });

  const handleToggleChange = (key: keyof ChartToggleState) => {
    setChartToggles(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Performance Metrics */}
            <MetricsCards metrics={mockStrategyResults.metrics} />

            {/* Main Chart */}
            <div className={`h-[500px] rounded-lg flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-zinc-900 border border-zinc-700'
                : 'bg-zinc-100 border border-zinc-300'
            }`}>
              <div className="text-center">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Strategy Performance Chart</h3>
                <p className={`mb-4 ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Equity curve and drawdown visualization</p>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'
                }`}>
                  Chart will be rendered here with lightweight-charts
                </div>
              </div>
            </div>

            {/* Chart Controls */}
            <div className="flex items-center justify-between">
              {/* Left side - Chart toggles */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartToggles.equity}
                    onChange={() => handleToggleChange('equity')}
                    className="w-4 h-4 text-green-400 bg-zinc-800 border-zinc-600 rounded focus:ring-green-400 focus:ring-2"
                  />
                  <TrendingUp className="w-4 h-4" />
                  <span>Equity</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartToggles.drawdown}
                    onChange={() => handleToggleChange('drawdown')}
                    className="w-4 h-4 text-purple-400 bg-zinc-800 border-zinc-600 rounded focus:ring-purple-400 focus:ring-2"
                  />
                  <BarChart3 className="w-4 h-4" />
                  <span>Drawdown</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartToggles.buyHold}
                    onChange={() => handleToggleChange('buyHold')}
                    className="w-4 h-4 text-orange-400 bg-zinc-800 border-zinc-600 rounded focus:ring-orange-400 focus:ring-2"
                  />
                  <TrendingDown className="w-4 h-4" />
                  <span>Buy & hold equity</span>
                </label>
              </div>

              {/* Right side - View mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('absolute')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    viewMode === 'absolute'
                      ? (theme === 'dark'
                          ? 'bg-zinc-700 text-white'
                          : 'bg-zinc-300 text-black')
                      : (theme === 'dark'
                          ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
                          : 'bg-zinc-200 text-zinc-600 hover:text-zinc-700')
                  }`}
                >
                  Absolute
                </button>
                <button
                  onClick={() => setViewMode('percentage')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    viewMode === 'percentage'
                      ? (theme === 'dark'
                          ? 'bg-zinc-700 text-white'
                          : 'bg-zinc-300 text-black')
                      : (theme === 'dark'
                          ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
                          : 'bg-zinc-200 text-zinc-600 hover:text-zinc-700')
                  }`}
                >
                  Percentage
                </button>
              </div>
            </div>
          </div>
        );

      case 'trades-list':
        return <TradesList trades={mockStrategyResults.trades} />;

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className={`rounded-lg p-6 ${
                theme === 'dark'
                  ? 'bg-zinc-900 border border-zinc-700'
                  : 'bg-zinc-100 border border-zinc-300'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Additional Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>Sharpe Ratio</span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>{mockStrategyResults.metrics.sharpeRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>Sortino Ratio</span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>{mockStrategyResults.metrics.sortinoRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>Largest Win</span>
                    <span className="text-green-400 font-medium">
                      ${mockStrategyResults.metrics.largestWin.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>Largest Loss</span>
                    <span className="text-red-400 font-medium">
                      ${mockStrategyResults.metrics.largestLoss.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`rounded-lg p-6 ${
                theme === 'dark'
                  ? 'bg-zinc-900 border border-zinc-700'
                  : 'bg-zinc-100 border border-zinc-300'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Trade Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>Average Win</span>
                    <span className="text-green-400 font-medium">
                      ${mockStrategyResults.metrics.avgWin.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>Average Loss</span>
                    <span className="text-red-400 font-medium">
                      ${mockStrategyResults.metrics.avgLoss.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>Gross Profit</span>
                    <span className="text-green-400 font-medium">
                      ${mockStrategyResults.metrics.grossProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>Gross Loss</span>
                    <span className="text-red-400 font-medium">
                      ${mockStrategyResults.metrics.grossLoss.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
              </h3>
              <p className="text-zinc-400">This section is coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`h-full flex flex-col ${
      theme === 'dark'
        ? 'bg-black text-white'
        : 'bg-white text-black'
    }`}>
      {/* Header Section */}
      <div className={`px-4 py-2.5 h-[38px] flex items-center ${
        theme === 'dark'
          ? 'bg-zinc-900 border-b border-zinc-700'
          : 'bg-zinc-100 border-b border-zinc-300'
      }`}>
        <div className="flex items-center justify-between w-full">
          {/* Left side - Strategy title dropdown */}
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'text-white hover:text-zinc-300'
                : 'text-black hover:text-zinc-700'
            }`}>
              <span className="font-medium text-sm truncate max-w-96">
                {mockStrategyResults.strategyName}
              </span>
              <ChevronDown className="w-3 h-3 flex-shrink-0" />
            </button>
          </div>

          {/* Right side - Deep Backtesting toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <span className={theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}>Deep Backtesting</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isDeepBacktesting}
                  onChange={(e) => setIsDeepBacktesting(e.target.checked)}
                  className="sr-only"
                />
                <div
                  onClick={() => setIsDeepBacktesting(!isDeepBacktesting)}
                  className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${
                    isDeepBacktesting ? 'bg-green-500' : 'bg-zinc-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      isDeepBacktesting ? 'translate-x-5' : 'translate-x-0.5'
                    } mt-0.5`}
                  />
                </div>
              </div>
              <Info className="w-3 h-3 text-zinc-500 hover:text-zinc-400 cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
