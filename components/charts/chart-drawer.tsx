"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import AlgoScriptEditor from "@/charting/components/charts/code-editor/CodeEditor";
import { StockScreener } from "./stock-screener/StockScreener";
import { StrategyTester } from "./strategy-tester/StrategyTester";

interface ChartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentHeight: number;
  codeEditorContent?: string;
}

export function ChartDrawer({ activeTab, codeEditorContent }: ChartDrawerProps) {
  const { theme } = useTheme();
  const drawerRef = useRef<HTMLDivElement>(null);
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



  const renderContent = () => {
    switch (activeTab) {
      case "brokers":
        return (
          <div className={`h-full rounded p-4 flex flex-col ${
            theme === 'dark'
              ? 'bg-black border border-zinc-800'
              : 'bg-white border border-zinc-300'
          }`}>
            {/* Header section */}
            <div className="flex-shrink-0 mb-6">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>Connected Brokers</h3>
            </div>
            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              {/* Centered "No brokers connected" message */}
              <div className="flex justify-center mb-24">
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>No brokers connected</p>
              </div>
              {/* Left-aligned "Connect through our trusted brokers" text */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Connect through our trusted brokers</h3>
              </div>

              {/* Broker cards grid */}
              <div className="flex-1">
                {/* Top 7 broker cards */}
                <div className="grid grid-cols-7 gap-3">
                    {/* Paper Trading */}
                    <div className={`rounded-lg p-3 transition-colors cursor-pointer aspect-square ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                        : 'bg-zinc-100 border border-zinc-300 hover:bg-zinc-200'
                    }`}>
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-white rounded mb-2 flex items-center justify-center">
                          <span className="text-black font-bold text-sm">TV</span>
                        </div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>Paper Trading</div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>Brokerage simulator by TradingView</div>
                        <div className={`flex items-center text-xs ${
                          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                        }`}>
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.6</span>
                        </div>
                      </div>
                    </div>

                    {/* Dhan */}
                    <div className={`rounded-lg p-3 transition-colors cursor-pointer aspect-square ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                        : 'bg-zinc-100 border border-zinc-300 hover:bg-zinc-200'
                    }`}>
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-green-500 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>Dhan</div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>Featured</div>
                        <div className={`flex items-center text-xs ${
                          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                        }`}>
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.6</span>
                        </div>
                      </div>
                    </div>

                    {/* BingX */}
                    <div className={`rounded-lg p-3 transition-colors cursor-pointer aspect-square ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                        : 'bg-zinc-100 border border-zinc-300 hover:bg-zinc-200'
                    }`}>
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-600 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">X</span>
                        </div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>BingX</div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                        }`}></div>
                        <div className={`flex items-center text-xs ${
                          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                        }`}>
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.7</span>
                        </div>
                      </div>
                    </div>

                    {/* AMP */}
                    <div className={`rounded-lg p-3 transition-colors cursor-pointer aspect-square ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                        : 'bg-zinc-100 border border-zinc-300 hover:bg-zinc-200'
                    }`}>
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-500 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>AMP</div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                        }`}></div>
                        <div className={`flex items-center text-xs ${
                          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                        }`}>
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.7</span>
                        </div>
                      </div>
                    </div>

                    {/* Fyers */}
                    <div className={`rounded-lg p-3 transition-colors cursor-pointer aspect-square ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                        : 'bg-zinc-100 border border-zinc-300 hover:bg-zinc-200'
                    }`}>
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-600 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>Fyers</div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                        }`}></div>
                        <div className={`flex items-center text-xs ${
                          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                        }`}>
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.6</span>
                        </div>
                      </div>
                    </div>

                    {/* TradeStation */}
                    <div className={`rounded-lg p-3 transition-colors cursor-pointer aspect-square ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                        : 'bg-zinc-100 border border-zinc-300 hover:bg-zinc-200'
                    }`}>
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-700 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>TradeStation</div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                        }`}></div>
                        <div className={`flex items-center text-xs ${
                          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                        }`}>
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">4.5</span>
                        </div>
                      </div>
                    </div>

                    {/* Tradovate */}
                    <div className={`rounded-lg p-3 transition-colors cursor-pointer aspect-square ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                        : 'bg-zinc-100 border border-zinc-300 hover:bg-zinc-200'
                    }`}>
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        <div className="w-8 h-8 bg-blue-600 rounded mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>Tradovate</div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                        }`}></div>
                        <div className={`flex items-center text-xs ${
                          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                        }`}>
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
          <div className={`h-full rounded overflow-hidden ${
            theme === 'dark'
              ? 'bg-black border border-zinc-800'
              : 'bg-white border border-zinc-300'
          }`} data-editor="true">
            <AlgoScriptEditor
              value={codeEditorContent || algoScript}
              onChange={setAlgoScript}
              autoFocus={true}
              onRun={handleRunScript}
              onSave={handleSaveScript}
              onPublish={handlePublishScript}
              theme={theme}
            />
          </div>
        );

      case "hft-panel":
        return (
          <div className={`rounded p-4 ${
            theme === 'dark'
              ? 'bg-black border border-zinc-800'
              : 'bg-white border border-zinc-300'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>High Frequency Trading</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Latency</h4>
                <div className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>0.3ms</div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Average execution time</p>
              </div>
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Order Flow</h4>
                <div className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>1,247</div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Orders per second</p>
              </div>
            </div>
          </div>
        );
      case "stocks-screener":
        return (
          <div className={`h-full rounded overflow-hidden ${
            theme === 'dark'
              ? 'bg-black border border-zinc-800'
              : 'bg-white border border-zinc-300'
          }`}>
            <StockScreener />
          </div>
        );
      case "strategy-tester":
        return (
          <div className={`h-full rounded overflow-hidden ${
            theme === 'dark'
              ? 'bg-black border border-zinc-800'
              : 'bg-white border border-zinc-300'
          }`}>
            <StrategyTester />
          </div>
        );
      default:
        return (
          <div className={`rounded p-4 ${
            theme === 'dark'
              ? 'bg-black border border-zinc-800'
              : 'bg-white border border-zinc-300'
          }`}>
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Select a tool to get started</h3>
          </div>
        );
    }
  };

  return (
    <div ref={drawerRef} className={`h-full flex flex-col ${
      theme === 'dark'
        ? 'bg-black text-white'
        : 'bg-white text-black'
    }`}>

      {/* Content area - takes full height with consistent padding and background */}
      <div className={`flex-1 overflow-y-auto p-1 ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`} data-drawer-content="true">
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