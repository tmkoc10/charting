"use client";

import { useState, useCallback } from "react";
import { ChartHeader } from "./chart-header";
import { ChartSidebarLeft } from "./chart-sidebar-left";
import { ChartSidebarRight } from "./chart-sidebar-right";
import { ChartFooter } from "./chart-footer";
import { TradingChart } from "./trading-chart";
import { ChartDrawer } from "./chart-drawer";
import { IndicatorLegend, AppliedIndicator, getIndicatorColor, getIndicatorShortName } from "./indicator-legend";
import { calculateIndicator } from "@/lib/indicators";
import { getChartData } from "@/lib/chart-data";

// Import the IndicatorType from chart-header
type IndicatorType = {
  id: string;
  name: string;
  description: string;
  category: 'trend' | 'momentum' | 'volatility' | 'support_resistance';
  parameters?: Record<string, number | string>;
};

export function ChartLayout() {
  const [isCrosshairMode, setIsCrosshairMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState("");
  const [drawerHeight, setDrawerHeight] = useState(50); // Percentage of screen height
  const [currentSymbol, setCurrentSymbol] = useState("NIFTY");
  const [currentTimeframe, setCurrentTimeframe] = useState("1H");
  const [appliedIndicators, setAppliedIndicators] = useState<AppliedIndicator[]>([]);

  const handleFooterTabClick = (tabId: string) => {
    setActiveDrawerTab(tabId);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setDrawerHeight(50); // Reset to default height when closing
  };

  const handleDrawerTabChange = (tabId: string) => {
    setActiveDrawerTab(tabId);
  };

  const handleDrawerResize = useCallback((newHeight: number) => {
    // Constrain height between 0% and 92% of screen height (leaving space for header)
    const constrainedHeight = Math.max(0, Math.min(92, newHeight));
    setDrawerHeight(constrainedHeight);
    
    // Close drawer if height goes below 5%
    if (constrainedHeight < 5) {
      setIsDrawerOpen(false);
      setDrawerHeight(50); // Reset to default for next open
    }
  }, []);

  const handleIndicatorAdd = useCallback((indicator: IndicatorType) => {
    try {
      // Get chart data for calculations
      const chartData = getChartData(currentSymbol, currentTimeframe);
      
      if (chartData.length === 0) {
        console.warn("No chart data available for indicator calculation");
        return;
      }

      // Convert chart data to OHLC format for indicator calculation
      const ohlcData = chartData.map(candle => ({
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        timestamp: candle.time
      }));

      // Calculate indicator values
      const numericParameters: Record<string, number> = {};
      if (indicator.parameters) {
        Object.entries(indicator.parameters).forEach(([key, value]) => {
          if (typeof value === 'number') {
            numericParameters[key] = value;
          } else if (typeof value === 'string') {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
              numericParameters[key] = parsed;
            }
          }
        });
      }
      const indicatorResults = calculateIndicator(indicator.id, ohlcData, numericParameters);
      
      if (indicatorResults.length === 0) {
        console.warn(`No results calculated for indicator: ${indicator.name}`);
        return;
      }

      // Get the latest values for display
      const latestResult = indicatorResults[indicatorResults.length - 1];
      let displayValues: Record<string, number> = {};

      if (typeof latestResult.value === 'number') {
        displayValues.main = latestResult.value;
      } else if (typeof latestResult.value === 'object') {
        displayValues = latestResult.value as Record<string, number>;
      }

      // Create applied indicator
      const appliedIndicator: AppliedIndicator = {
        id: `${indicator.id}_${Date.now()}`, // Unique ID
        name: indicator.name,
        shortName: getIndicatorShortName(indicator.id),
        parameters: indicator.parameters || {},
        values: displayValues,
        color: getIndicatorColor(appliedIndicators.length),
        visible: true
      };

      // Add to applied indicators
      setAppliedIndicators(prev => [...prev, appliedIndicator]);
      
      console.log("Indicator added successfully:", appliedIndicator);
    } catch (error) {
      console.error("Error adding indicator:", error);
    }
  }, [currentSymbol, currentTimeframe, appliedIndicators.length]);

  const handleIndicatorToggleVisibility = useCallback((indicatorId: string) => {
    setAppliedIndicators(prev => 
      prev.map(indicator => 
        indicator.id === indicatorId 
          ? { ...indicator, visible: !indicator.visible }
          : indicator
      )
    );
  }, []);

  const handleIndicatorRemove = useCallback((indicatorId: string) => {
    setAppliedIndicators(prev => prev.filter(indicator => indicator.id !== indicatorId));
  }, []);

  const handleIndicatorEdit = useCallback((indicatorId: string) => {
    // TODO: Implement indicator settings dialog
    console.log("Edit indicator:", indicatorId);
  }, []);

  const chartHeight = isDrawerOpen ? 100 - drawerHeight : 100;

  return (
    <div className="h-screen bg-zinc-900 text-white flex flex-col overflow-hidden gap-1">
      {/* Header - Full width at top, 38px height like TradingView */}
      <div className="h-[38px] flex-shrink-0 p-1">
        <ChartHeader 
          onSymbolChange={setCurrentSymbol}
          onTimeframeChange={setCurrentTimeframe}
          onIndicatorAdd={handleIndicatorAdd}
        />
      </div>

      {/* Main content area below header */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - extends full height from header to bottom */}
        <div className="w-[52px] flex-shrink-0 p-1 pr-0">
          <ChartSidebarLeft 
            isCrosshairMode={isCrosshairMode}
            onCrosshairToggle={setIsCrosshairMode}
          />
        </div>

        {/* Center content area - this is what gets squeezed */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chart + Footer container - dynamically sized based on drawer */}
          <div 
            className="flex flex-col min-h-0 p-1 transition-all duration-200 ease-out"
            style={{
              height: `${chartHeight}%`
            }}
          >
            {/* Chart Area - takes most space */}
            <div className="flex-1 min-h-0 mb-1 relative">
              <TradingChart 
                isCrosshairMode={isCrosshairMode} 
                symbol={currentSymbol}
                timeframe={currentTimeframe}
                appliedIndicators={appliedIndicators}
              />
              
              {/* Indicator Legend Overlay */}
              <IndicatorLegend
                indicators={appliedIndicators}
                onToggleVisibility={handleIndicatorToggleVisibility}
                onRemoveIndicator={handleIndicatorRemove}
                onEditIndicator={handleIndicatorEdit}
              />
            </div>

            {/* Footer - 38px height */}
            <div className="h-[38px] flex-shrink-0">
              <ChartFooter 
                onTabClick={handleFooterTabClick} 
                activeTab={activeDrawerTab}
                isDrawerOpen={isDrawerOpen}
                onClose={handleDrawerClose}
              />
            </div>
          </div>

          {/* Chart Drawer - takes remaining space when open */}
          {isDrawerOpen && (
            <div 
              className="border-t border-zinc-700 transition-all duration-200 ease-out"
              style={{ height: `${drawerHeight}%` }}
            >
              <ChartDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                activeTab={activeDrawerTab}
                onTabChange={handleDrawerTabChange}
                onResize={handleDrawerResize}
                currentHeight={drawerHeight}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar - extends full height from header to bottom */}
        <div className="w-[52px] flex-shrink-0 p-1 pl-0">
          <ChartSidebarRight />
        </div>
      </div>
    </div>
  );
}
