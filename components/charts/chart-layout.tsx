"use client";

import { useState, useCallback } from "react";
import { useTheme } from "@/lib/theme-context";
import { ChartHeader } from "./chart-header";
import { ChartSidebarLeft } from "./chart-sidebar-left";
import { ChartSidebarRight } from "./chart-sidebar-right";
import { ChartFooter } from "./chart-footer";
import { TradingChart } from "./trading-chart";
import { ChartDrawer } from "./chart-drawer";
import { ChartRightDrawer } from "./chart-right-drawer";
import { DrawerResizeHandle } from "./drawer-resize-handle";
import { IndicatorLegend, AppliedIndicator, getIndicatorColor, getIndicatorShortName, getIndicatorSourceCode } from "./indicator-legend";
import { calculateIndicator } from "@/lib/indicators";
import { getChartData } from "@/lib/chart-data";
import { motion, AnimatePresence } from "framer-motion";

// Import the IndicatorType from chart-header
type IndicatorType = {
  id: string;
  name: string;
  description: string;
  category: 'trend' | 'momentum' | 'volatility' | 'support_resistance';
  parameters?: Record<string, number | string>;
};

export function ChartLayout() {
  const { theme } = useTheme();
  const [isCrosshairMode, setIsCrosshairMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState("");
  const [drawerHeight, setDrawerHeight] = useState(50); // Percentage of screen height
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [activeRightDrawerTab, setActiveRightDrawerTab] = useState("");
  const [isDrawerResizing, setIsDrawerResizing] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState("NIFTY");
  const [currentTimeframe, setCurrentTimeframe] = useState("1H");
  const [appliedIndicators, setAppliedIndicators] = useState<AppliedIndicator[]>([]);
  const [codeEditorContent, setCodeEditorContent] = useState("");

  const handleFooterTabClick = (tabId: string) => {
    setActiveDrawerTab(tabId);
    setIsDrawerOpen(true);
    // Reset to default height when opening via footer tabs
    setDrawerHeight(50);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setDrawerHeight(50); // Reset to default height when closing
  };

  const handleDrawerTabChange = (tabId: string) => {
    setActiveDrawerTab(tabId);
  };

  const handleRightDrawerTabClick = (tabId: string) => {
    if (isRightDrawerOpen && activeRightDrawerTab === tabId) {
      // If clicking the same tab that's already open, close the drawer
      setIsRightDrawerOpen(false);
      setActiveRightDrawerTab("");
    } else {
      // Open drawer with the selected tab
      setActiveRightDrawerTab(tabId);
      setIsRightDrawerOpen(true);
    }
  };

  const handleRightDrawerClose = () => {
    setIsRightDrawerOpen(false);
    setActiveRightDrawerTab("");
  };

  const handleDrawerResize = useCallback((newHeight: number) => {
    // Constrain height between 0% and 92% of screen height (leaving space for header)
    const constrainedHeight = Math.max(0, Math.min(92, newHeight));

    // Use functional updates to ensure we have the latest state
    setDrawerHeight(constrainedHeight);

    // Use functional updates for drawer state to avoid stale closure issues
    setIsDrawerOpen(currentIsOpen => {
      // Open drawer if height goes above 5% and it's currently closed
      if (constrainedHeight > 5 && !currentIsOpen) {
        return true;
      }

      // Close drawer if height goes below 5% and it's currently open
      if (constrainedHeight < 5 && currentIsOpen) {
        // Don't reset height here - let it stay at the dragged position
        // Height will be reset to 50% only when drawer is reopened via footer tabs
        return false;
      }

      return currentIsOpen;
    });
  }, []); // Remove dependency on isDrawerOpen since we use functional updates

  const handleDrawerResizeStart = useCallback(() => {
    setIsDrawerResizing(true);
  }, []);

  const handleDrawerResizeEnd = useCallback(() => {
    setIsDrawerResizing(false);
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
        visible: true,
        sourceCode: getIndicatorSourceCode(indicator.id)
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

  const handleIndicatorOpenCodeEditor = useCallback((indicatorId: string) => {
    // Find the indicator to get its type
    const indicator = appliedIndicators.find(ind => ind.id === indicatorId);
    if (indicator) {
      // Extract the base indicator type from the ID (remove timestamp)
      const baseIndicatorId = indicator.id.split('_')[0];
      const sourceCode = getIndicatorSourceCode(baseIndicatorId);

      // Set the code editor content and open the drawer
      setCodeEditorContent(sourceCode);
      setActiveDrawerTab("code-editor");
      setIsDrawerOpen(true);
      // Reset to default height when opening programmatically
      setDrawerHeight(50);

      console.log("Opening code editor for indicator:", baseIndicatorId);
    }
  }, [appliedIndicators]);

  const chartHeight = isDrawerOpen ? 100 - drawerHeight : 100;

  return (
    <div className={`h-screen flex flex-col overflow-hidden gap-1 ${
      theme === 'dark'
        ? 'bg-zinc-900 text-white'
        : 'bg-zinc-100 text-black'
    }`}>
      {/* Header - Full width at top, 38px height like TradingView */}
      <div className="h-[38px] flex-shrink-0 p-1">
        <ChartHeader
          onSymbolChange={setCurrentSymbol}
          onTimeframeChange={setCurrentTimeframe}
          onIndicatorAdd={handleIndicatorAdd}
          isCodeEditorActive={isDrawerOpen && activeDrawerTab === "code-editor"}
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
        <motion.div
          className="flex flex-col min-w-0 flex-1"
          transition={{
            duration: 0.35,
            ease: [0.25, 0.1, 0.25, 1.0]
          }}
        >
          {/* Chart + Footer container - dynamically sized based on drawer */}
          <div
            className={`flex flex-col min-h-0 p-1 ${
              isDrawerResizing
                ? ''
                : 'transition-all duration-300 ease-out'
            }`}
            style={{
              height: `${chartHeight}%`
            }}
          >
            {/* Chart Area - takes most space */}
            <div className="flex-1 min-h-0 relative">
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
                onOpenCodeEditor={handleIndicatorOpenCodeEditor}
              />
            </div>

            {/* Resize Handle - always visible between chart and footer */}
            <DrawerResizeHandle
              onResize={handleDrawerResize}
              onResizeStart={handleDrawerResizeStart}
              onResizeEnd={handleDrawerResizeEnd}
              currentHeight={drawerHeight}
              isDrawerOpen={isDrawerOpen}
            />

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
              className={`${
                isDrawerResizing
                  ? ''
                  : 'transition-all duration-300 ease-out'
              }`}
              style={{ height: `${drawerHeight}%` }}
            >
              <ChartDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                activeTab={activeDrawerTab}
                onTabChange={handleDrawerTabChange}
                currentHeight={drawerHeight}
                codeEditorContent={codeEditorContent}
              />
            </div>
          )}
        </motion.div>

        {/* Right Drawer - slides in from left edge of right sidebar */}
        <AnimatePresence mode="wait">
          {isRightDrawerOpen && (
            <motion.div
              key="right-drawer"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "20%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1.0]
              }}
              className="flex-shrink-0 overflow-hidden p-1 pl-0"
            >
              <div className={`w-full h-full rounded flex flex-col ${
                theme === 'dark'
                  ? 'bg-black border border-zinc-800'
                  : 'bg-white border border-zinc-300'
              }`}>
                <ChartRightDrawer
                  isOpen={isRightDrawerOpen}
                  onClose={handleRightDrawerClose}
                  activeTab={activeRightDrawerTab}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Sidebar - extends full height from header to bottom */}
        <div className="w-[52px] flex-shrink-0 p-1 pl-0">
          <ChartSidebarRight
            onTabClick={handleRightDrawerTabClick}
            activeTab={activeRightDrawerTab}
            isDrawerOpen={isRightDrawerOpen}
          />
        </div>
      </div>
    </div>
  );
}
