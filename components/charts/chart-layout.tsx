"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { ChartHeader, ChartType } from "./chart-header";
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

// Type definitions for browser fullscreen APIs
interface ExtendedHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

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
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState("NIFTY");
  const [currentTimeframe, setCurrentTimeframe] = useState("1H");
  const [currentChartType, setCurrentChartType] = useState<ChartType>("candlestick");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [appliedIndicators, setAppliedIndicators] = useState<AppliedIndicator[]>([]);
  const [codeEditorContent, setCodeEditorContent] = useState("");

  // Browser fullscreen API utilities
  const requestFullscreen = useCallback(async () => {
    try {
      const element = document.documentElement as ExtendedHTMLElement;

      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      } else {
        // Fallback to custom fullscreen if browser doesn't support fullscreen API
        setIsFullscreen(true);
        return;
      }
    } catch (error) {
      console.warn('Failed to enter fullscreen mode:', error);
      // Fallback to custom fullscreen
      setIsFullscreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      const extendedDocument = document as ExtendedDocument;

      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (extendedDocument.webkitExitFullscreen) {
        await extendedDocument.webkitExitFullscreen();
      } else if (extendedDocument.mozCancelFullScreen) {
        await extendedDocument.mozCancelFullScreen();
      } else if (extendedDocument.msExitFullscreen) {
        await extendedDocument.msExitFullscreen();
      } else {
        // Fallback to custom fullscreen
        setIsFullscreen(false);
        return;
      }
    } catch (error) {
      console.warn('Failed to exit fullscreen mode:', error);
      // Fallback to custom fullscreen
      setIsFullscreen(false);
    }
  }, []);

  // Check if browser is in fullscreen mode
  const isDocumentFullscreen = useCallback(() => {
    const extendedDocument = document as ExtendedDocument;
    return !!(
      document.fullscreenElement ||
      extendedDocument.webkitFullscreenElement ||
      extendedDocument.mozFullScreenElement ||
      extendedDocument.msFullscreenElement
    );
  }, []);

  // Fullscreen toggle function
  const toggleFullscreen = useCallback(async () => {
    if (isDocumentFullscreen()) {
      await exitFullscreen();
    } else {
      await requestFullscreen();
    }
  }, [isDocumentFullscreen, exitFullscreen, requestFullscreen]);

  // Handle fullscreen change events from browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = isDocumentFullscreen();
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add event listeners for all browser prefixes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isDocumentFullscreen]);

  const handleFooterTabClick = (tabId: string) => {
    setActiveDrawerTab(tabId);

    // Only reset to default height when opening a closed drawer
    // Preserve current height when switching between tabs of an already-open drawer
    if (!isDrawerOpen) {
      setIsDrawerOpen(true);
      setDrawerHeight(50);
    }
    // If drawer is already open, just switch tabs without changing height
    else {
      // Drawer stays open with current height preserved
    }
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
    setIsAnimationPaused(true);
  }, []);

  const handleDrawerResizeEnd = useCallback(() => {
    setIsDrawerResizing(false);
    // Use a small delay to allow final position to settle before re-enabling animations
    setTimeout(() => {
      setIsAnimationPaused(false);
    }, 50);
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

      // Create applied indicator with a predictable ID to avoid hydration issues
      // Use a counter-based approach that's deterministic
      const indicatorCounter = appliedIndicators.filter(ind => ind.name === indicator.name).length;
      const appliedIndicator: AppliedIndicator = {
        id: `${indicator.id}_${indicatorCounter}`, // Unique ID based on indicator type and count
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
  }, [currentSymbol, currentTimeframe, appliedIndicators]);

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

      // Only reset to default height when opening a closed drawer
      // Preserve current height when switching to code editor on an already-open drawer
      if (!isDrawerOpen) {
        setIsDrawerOpen(true);
        setDrawerHeight(50);
      }

      console.log("Opening code editor for indicator:", baseIndicatorId);
    }
  }, [appliedIndicators, isDrawerOpen]);

  // Handler for opening code editor from indicators popup (header)
  const handleHeaderIndicatorOpenCodeEditor = useCallback((indicatorId: string) => {
    // Get the source code directly from the indicator ID
    const sourceCode = getIndicatorSourceCode(indicatorId);

    // Set the code editor content and open the drawer
    setCodeEditorContent(sourceCode);
    setActiveDrawerTab("code-editor");

    // Only reset to default height when opening a closed drawer
    // Preserve current height when switching to code editor on an already-open drawer
    if (!isDrawerOpen) {
      setIsDrawerOpen(true);
      setDrawerHeight(50);
    }

    console.log("Opening code editor for indicator from header:", indicatorId);
  }, [isDrawerOpen]);

  const chartHeight = isDrawerOpen ? 100 - drawerHeight : 100;

  return (
    <>
      {/* Global CSS for fullscreen mode */}
      {isFullscreen && (
        <style jsx global>{`
          body {
            overflow: hidden !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
        `}</style>
      )}

      <div
        className={`${isFullscreen ? 'fixed inset-0 w-screen h-screen' : 'h-screen'} flex flex-col overflow-hidden ${isFullscreen ? 'gap-0' : 'gap-1'} ${
          theme === 'dark'
            ? 'bg-zinc-900 text-white'
            : 'bg-zinc-100 text-black'
        } ${isFullscreen ? 'z-[9999]' : ''}`}
        style={{
          willChange: isDrawerResizing || isRightDrawerOpen ? 'transform' : 'auto'
        }}
      >
      {/* Header - Full width at top, 38px height like TradingView */}
      {!isFullscreen && (
        <div className="h-[38px] flex-shrink-0 p-1">
          <ChartHeader
            onSymbolChange={setCurrentSymbol}
            onTimeframeChange={setCurrentTimeframe}
            onChartTypeChange={setCurrentChartType}
            onIndicatorAdd={handleIndicatorAdd}
            onIndicatorOpenCodeEditor={handleHeaderIndicatorOpenCodeEditor}
            isCodeEditorActive={isDrawerOpen && activeDrawerTab === "code-editor"}
            isFullscreen={isFullscreen}
            onFullscreenToggle={toggleFullscreen}
          />
        </div>
      )}

      {/* Main content area below header */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - extends full height from header to bottom */}
        {!isFullscreen && (
          <div className="w-[52px] flex-shrink-0 p-1 pr-0">
            <ChartSidebarLeft
              isCrosshairMode={isCrosshairMode}
              onCrosshairToggle={setIsCrosshairMode}
            />
          </div>
        )}

        {/* Center content area - this is what gets squeezed */}
        <motion.div
          className="flex flex-col min-w-0 flex-1"
          transition={{
            duration: isAnimationPaused ? 0 : 0.2,
            ease: [0.25, 0.1, 0.25, 1.0]
          }}
          style={{
            willChange: isRightDrawerOpen ? 'width, transform' : 'auto'
          }}
        >
          {isFullscreen ? (
            /* True Fullscreen mode - Chart fills entire browser viewport */
            <div className="w-full h-full relative">
              <TradingChart
                isCrosshairMode={isCrosshairMode}
                symbol={currentSymbol}
                timeframe={currentTimeframe}
                chartType={currentChartType}
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

              {/* Fullscreen exit hint - subtle overlay */}
              <div className="absolute top-4 right-4 z-50 opacity-30 hover:opacity-100 transition-opacity duration-300">
                <div className={`px-3 py-1.5 rounded-lg text-xs ${
                  theme === 'dark'
                    ? 'bg-black/60 text-zinc-400 border border-zinc-700'
                    : 'bg-white/60 text-zinc-600 border border-zinc-300'
                }`}>
                  Press Esc to exit fullscreen
                </div>
              </div>
            </div>
          ) : (
            /* Normal mode - Chart + Footer container */
            <>
              <div
                className={`flex flex-col min-h-0 p-1 ${
                  isDrawerResizing || isAnimationPaused
                    ? 'will-change-transform'
                    : 'transition-all duration-200 ease-out'
                }`}
                style={{
                  height: `${chartHeight}%`,
                  willChange: isDrawerResizing ? 'height, transform' : 'auto'
                }}
              >
                {/* Chart Area - takes most space */}
                <div className="flex-1 min-h-0 relative">
                  <TradingChart
                    isCrosshairMode={isCrosshairMode}
                    symbol={currentSymbol}
                    timeframe={currentTimeframe}
                    chartType={currentChartType}
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
                    isAnimationPaused={isAnimationPaused}
                  />
                </div>
              </div>

              {/* Chart Drawer - takes remaining space when open */}
              {isDrawerOpen && (
                <div
                  className={`${
                    isDrawerResizing || isAnimationPaused
                      ? 'will-change-transform'
                      : 'transition-all duration-200 ease-out'
                  }`}
                  style={{
                    height: `${drawerHeight}%`,
                    willChange: isDrawerResizing ? 'height, transform' : 'auto'
                  }}
                >
                  <ChartDrawer
                    isOpen={isDrawerOpen}
                    onClose={handleDrawerClose}
                    activeTab={activeDrawerTab}
                    onTabChange={handleDrawerTabChange}
                    currentHeight={drawerHeight}
                    codeEditorContent={codeEditorContent}
                    isAnimationPaused={isAnimationPaused}
                  />
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Right Drawer - slides in from left edge of right sidebar */}
        {!isFullscreen && (
          <AnimatePresence mode="wait">
            {isRightDrawerOpen && (
              <motion.div
                key="right-drawer"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "20%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  duration: isAnimationPaused ? 0 : 0.2,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
                className="flex-shrink-0 overflow-hidden p-1 pl-0"
                style={{
                  willChange: 'width, transform, opacity'
                }}
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
                    isAnimationPaused={isAnimationPaused}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Right Sidebar - extends full height from header to bottom */}
        {!isFullscreen && (
          <div className="w-[52px] flex-shrink-0 p-1 pl-0">
            <ChartSidebarRight
              onTabClick={handleRightDrawerTabClick}
              activeTab={activeRightDrawerTab}
              isDrawerOpen={isRightDrawerOpen}
            />
          </div>
        )}
      </div>
    </div>
    </>
  );
}
