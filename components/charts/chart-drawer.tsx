"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import AlgoScriptEditor from "@/charting/components/charts/code-editor/CodeEditor";
import { StockScreener } from "./stock-screener/StockScreener";
import { StrategyTester } from "./strategy-tester/StrategyTester";

interface ChartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onResize: (newHeight: number) => void;
  currentHeight: number;
  codeEditorContent?: string;
}

export function ChartDrawer({ activeTab, onResize, currentHeight, codeEditorContent }: ChartDrawerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);
  const [algoScript, setAlgoScript] = useState("");

  const handleRunScript = async () => {
    console.log("Running algo script:", algoScript);
    // Add your script execution logic here
  };

  const handleSaveScript = () => {
    console.log("Saving algo script:", algoScript);
    // Add your script saving logic here
  };

  const handlePublishScript = () => {
    console.log("Publishing algo script:", algoScript);
    // Add your script publishing logic here
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaY = startY.current - e.clientY; // Inverted because we want upward drag to increase height
    const viewportHeight = window.innerHeight;
    const deltaPercentage = (deltaY / viewportHeight) * 100;
    const newHeight = startHeight.current + deltaPercentage;

    onResize(newHeight);
  }, [onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const deltaY = startY.current - e.touches[0].clientY;
    const viewportHeight = window.innerHeight;
    const deltaPercentage = (deltaY / viewportHeight) * 100;
    const newHeight = startHeight.current + deltaPercentage;

    onResize(newHeight);
  }, [onResize]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = currentHeight;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [currentHeight, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = currentHeight;

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [currentHeight, handleTouchMove, handleTouchEnd]);

  const renderContent = () => {
    switch (activeTab) {
      case "brokers":
        return (
          <div className="h-full bg-black border border-zinc-800 rounded p-4 flex flex-col">
            {/* Header section */}
            <div className="flex-shrink-0 mb-6">
              <h3 className="text-lg font-semibold text-white">Connected Brokers</h3>
            </div>
            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              {/* Centered "No brokers connected" message */}
              <div className="flex justify-center mb-24">
                <p className="text-zinc-400 text-sm">No brokers connected</p>
              </div>
              {/* Left-aligned "Connect through our trusted brokers" text */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Connect through our trusted brokers</h3>
              </div>

              {/* Broker cards grid */}
              <div className="flex-1">
                {/* Top 7 broker cards */}
                <div className="grid grid-cols-7 gap-3">
                    {/* Paper Trading */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer aspect-square">
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-white rounded mb-2 flex items-center justify-center">
                          <span className="text-black font-bold text-sm">TV</span>
                        </div>
                        <div className="text-xs text-white font-medium mb-1">Paper Trading</div>
                        <div className="text-xs text-zinc-400 mb-2">Brokerage simulator by TradingView</div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.6</span>
                        </div>
                      </div>
                    </div>

                    {/* Dhan */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer aspect-square">
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-green-500 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <div className="text-xs text-white font-medium mb-1">Dhan</div>
                        <div className="text-xs text-zinc-400 mb-2">Featured</div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.6</span>
                        </div>
                      </div>
                    </div>

                    {/* BingX */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer aspect-square">
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-600 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">X</span>
                        </div>
                        <div className="text-xs text-white font-medium mb-1">BingX</div>
                        <div className="text-xs text-zinc-400 mb-2"></div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.7</span>
                        </div>
                      </div>
                    </div>

                    {/* AMP */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer aspect-square">
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-500 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <div className="text-xs text-white font-medium mb-1">AMP</div>
                        <div className="text-xs text-zinc-400 mb-2"></div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.7</span>
                        </div>
                      </div>
                    </div>

                    {/* Fyers */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer aspect-square">
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-600 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <div className="text-xs text-white font-medium mb-1">Fyers</div>
                        <div className="text-xs text-zinc-400 mb-2"></div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.6</span>
                        </div>
                      </div>
                    </div>

                    {/* TradeStation */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer aspect-square">
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-700 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <div className="text-xs text-white font-medium mb-1">TradeStation</div>
                        <div className="text-xs text-zinc-400 mb-2"></div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.5</span>
                        </div>
                      </div>
                    </div>

                    {/* Tradovate */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer aspect-square">
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-600 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <div className="text-xs text-white font-medium mb-1">Tradovate</div>
                        <div className="text-xs text-zinc-400 mb-2"></div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.5</span>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "code-editor":
        return (
          <div className="h-full bg-black border border-zinc-800 rounded overflow-hidden" data-editor="true">
            <AlgoScriptEditor
              value={codeEditorContent || algoScript}
              onChange={setAlgoScript}
              autoFocus={true}
              onRun={handleRunScript}
              onSave={handleSaveScript}
              onPublish={handlePublishScript}
            />
          </div>
        );

      case "hft-panel":
        return (
          <div className="bg-black border border-zinc-800 rounded p-4">
            <h3 className="text-lg font-semibold mb-4">High Frequency Trading</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="font-medium mb-2">Latency</h4>
                <div className="text-2xl font-bold">0.3ms</div>
                <p className="text-sm text-zinc-400">Average execution time</p>
              </div>
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="font-medium mb-2">Order Flow</h4>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-zinc-400">Orders per second</p>
              </div>
            </div>
          </div>
        );
      case "stocks-screener":
        return (
          <div className="h-full bg-black border border-zinc-800 rounded overflow-hidden">
            <StockScreener />
          </div>
        );
      case "strategy-tester":
        return (
          <div className="h-full bg-black border border-zinc-800 rounded overflow-hidden">
            <StrategyTester />
          </div>
        );
      default:
        return (
          <div className="bg-black border border-zinc-800 rounded p-4">
            <h3 className="text-lg font-semibold">Select a tool to get started</h3>
          </div>
        );
    }
  };

  return (
    <div ref={drawerRef} className="h-full bg-black text-white flex flex-col">
      {/* Draggable Handle */}
      <div className="relative">
        {/* Top border/separator */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"></div>

        {/* Draggable button in the middle */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <motion.div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className={cn(
                "w-12 h-[18px] bg-zinc-700 rounded-full cursor-ns-resize flex items-center justify-center",
                "hover:bg-zinc-600 transition-colors duration-200",
                "border border-zinc-600 shadow-lg",
                "touch-none select-none",
                isDragging && "bg-zinc-500 scale-110"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Drag handle lines */}
              <div className="flex flex-col gap-0.5">
                <div className={cn(
                  "w-6 h-0.5 rounded-full transition-colors duration-200",
                  isDragging ? "bg-zinc-200" : "bg-zinc-400"
                )}></div>
                <div className={cn(
                  "w-6 h-0.5 rounded-full transition-colors duration-200",
                  isDragging ? "bg-zinc-200" : "bg-zinc-400"
                )}></div>
                <div className={cn(
                  "w-6 h-0.5 rounded-full transition-colors duration-200",
                  isDragging ? "bg-zinc-200" : "bg-zinc-400"
                )}></div>
              </div>
            </motion.div>

            {/* Height indicator tooltip */}
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded border border-zinc-600 shadow-lg"
              >
                {Math.round(currentHeight)}%
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Content area - takes full height with consistent padding and background */}
      <div className="flex-1 overflow-y-auto bg-black p-1" data-drawer-content="true">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}