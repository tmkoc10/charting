"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onResize: (newHeight: number) => void;
  currentHeight: number;
}

export function ChartDrawer({ activeTab, onResize, currentHeight }: ChartDrawerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

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
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Broker Connections</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="font-medium mb-2">Zerodha</h4>
                <p className="text-sm text-zinc-400">Connect your Zerodha account</p>
                <button className="mt-2 px-3 py-1 bg-zinc-700 text-white rounded text-sm">
                  Connect
                </button>
              </div>
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="font-medium mb-2">Upstox</h4>
                <p className="text-sm text-zinc-400">Connect your Upstox account</p>
                <button className="mt-2 px-3 py-1 bg-zinc-700 text-white rounded text-sm">
                  Connect
                </button>
              </div>
            </div>
          </div>
        );
      case "code-editor":
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pine Script Editor</h3>
            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm">
              <div className="text-zinc-400">{'// Pine Script v5'}</div>
              <div className="text-zinc-300">{'@version=5'}</div>
              <div className="text-zinc-200">indicator(&quot;My Script&quot;, overlay=true)</div>
              <div className="mt-2 text-zinc-300">
                {/* Add your trading logic here */}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-zinc-700 text-white rounded">
                Run Script
              </button>
              <button className="px-4 py-2 bg-zinc-700 text-white rounded">
                Save
              </button>
            </div>
          </div>
        );
      case "strategy-tester":
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Strategy Backtesting</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-zinc-800 rounded">
                <div className="text-sm text-zinc-400">Total Return</div>
                <div className="text-lg font-semibold text-zinc-200">+24.5%</div>
              </div>
              <div className="p-3 bg-zinc-800 rounded">
                <div className="text-sm text-zinc-400">Win Rate</div>
                <div className="text-lg font-semibold">68.2%</div>
              </div>
              <div className="p-3 bg-zinc-800 rounded">
                <div className="text-sm text-zinc-400">Max Drawdown</div>
                <div className="text-lg font-semibold text-zinc-300">-8.1%</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-zinc-700 text-white rounded">
              Run Backtest
            </button>
          </div>
        );
      case "hft-panel":
        return (
          <div className="p-6">
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
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stock Screener</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-zinc-800 rounded">
                <div>
                  <div className="font-medium">RELIANCE</div>
                  <div className="text-sm text-zinc-400">Reliance Industries</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹2,847.50</div>
                  <div className="text-sm text-zinc-300">+1.2%</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-800 rounded">
                <div>
                  <div className="font-medium">TCS</div>
                  <div className="text-sm text-zinc-400">Tata Consultancy Services</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹4,123.75</div>
                  <div className="text-sm text-zinc-400">-0.8%</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
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
                "w-12 h-6 bg-zinc-700 rounded-full cursor-ns-resize flex items-center justify-center",
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
      
      {/* Content area - takes full height */}
      <div className="flex-1 overflow-y-auto bg-black pt-3">
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