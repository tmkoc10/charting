"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";

interface ChartRightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
}

export function ChartRightDrawer({ isOpen, onClose, activeTab }: ChartRightDrawerProps) {
  const { theme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case "bookmark":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Bookmarks
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
              <p className="mb-4">Save your favorite charts, symbols, and analysis for quick access.</p>
              <div className="space-y-2">
                <div className={`p-3 rounded border ${
                  theme === 'dark' 
                    ? 'border-zinc-700 bg-zinc-800/50' 
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium">NIFTY 1H Chart</div>
                  <div className="text-xs opacity-70">Saved 2 hours ago</div>
                </div>
                <div className={`p-3 rounded border ${
                  theme === 'dark' 
                    ? 'border-zinc-700 bg-zinc-800/50' 
                    : 'border-zinc-300 bg-zinc-50'
                }`}>
                  <div className="font-medium">BANKNIFTY Analysis</div>
                  <div className="text-xs opacity-70">Saved yesterday</div>
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
        transition={{ duration: 0.2 }}
        className="h-full overflow-y-auto pt-3"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}
