"use client";

import { motion } from "framer-motion";

interface ChartFooterProps {
  onTabClick: (tabId: string) => void;
  activeTab: string;
  isDrawerOpen: boolean;
  onClose: () => void;
}

export function ChartFooter({ onTabClick, activeTab, isDrawerOpen, onClose }: ChartFooterProps) {

  return (
    <footer className="h-full bg-black border border-zinc-800 rounded flex items-center justify-start px-4 text-xs relative z-20">
      {/* Tool tabs like TradingView - aligned to left with capsule styling */}
      <div className="flex items-center gap-2 relative">
        {/* Brokers Tab */}
        <motion.button
          onClick={() => {
            if (isDrawerOpen && activeTab === "brokers") {
              onClose();
            } else {
              onTabClick("brokers");
            }
          }}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-full text-sm ${
            isDrawerOpen && activeTab === "brokers"
              ? 'text-white shadow-lg'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Active Tab Background */}
          {isDrawerOpen && activeTab === "brokers" && (
            <motion.div
              layoutId="activeFooterTab"
              className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          <div className="relative flex items-center gap-1.5">
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
              className={`transition-all duration-300 ${
                isDrawerOpen && activeTab === "brokers" ? 'text-white scale-110' : 'text-zinc-400'
              }`}
            >
              <path d="M3 21h18"></path>
              <path d="M5 21V7l8-4v18"></path>
              <path d="M19 21V11l-6-4"></path>
            </svg>
            <span className="font-medium">Brokers</span>
          </div>

          {/* Active Tab Glow Effect */}
          {isDrawerOpen && activeTab === "brokers" && (
            <div className="absolute inset-0 bg-zinc-700/30 rounded-full blur-md -z-10"></div>
          )}
        </motion.button>

        {/* Code Editor Tab */}
        <motion.button
          onClick={() => {
            if (isDrawerOpen && activeTab === "code-editor") {
              onClose();
            } else {
              onTabClick("code-editor");
            }
          }}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-full text-sm ${
            isDrawerOpen && activeTab === "code-editor"
              ? 'text-white shadow-lg'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Active Tab Background */}
          {isDrawerOpen && activeTab === "code-editor" && (
            <motion.div
              layoutId="activeFooterTab"
              className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          <div className="relative flex items-center gap-1.5">
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
              className={`transition-all duration-300 ${
                isDrawerOpen && activeTab === "code-editor" ? 'text-white scale-110' : 'text-zinc-400'
              }`}
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span className="font-medium">Algo Script</span>
          </div>

          {/* Active Tab Glow Effect */}
          {isDrawerOpen && activeTab === "code-editor" && (
            <div className="absolute inset-0 bg-zinc-700/30 rounded-full blur-md -z-10"></div>
          )}
        </motion.button>

        {/* Strategy Tester Tab */}
        <motion.button
          onClick={() => {
            if (isDrawerOpen && activeTab === "strategy-tester") {
              onClose();
            } else {
              onTabClick("strategy-tester");
            }
          }}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-full text-sm ${
            isDrawerOpen && activeTab === "strategy-tester"
              ? 'text-white shadow-lg'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Active Tab Background */}
          {isDrawerOpen && activeTab === "strategy-tester" && (
            <motion.div
              layoutId="activeFooterTab"
              className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          <div className="relative flex items-center gap-1.5">
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
              className={`transition-all duration-300 ${
                isDrawerOpen && activeTab === "strategy-tester" ? 'text-white scale-110' : 'text-zinc-400'
              }`}
            >
              <path d="M3 3v18h18"></path>
              <path d="M7 12l3-3 3 3 5-5"></path>
            </svg>
            <span className="font-medium">Strategy Tester</span>
          </div>

          {/* Active Tab Glow Effect */}
          {isDrawerOpen && activeTab === "strategy-tester" && (
            <div className="absolute inset-0 bg-zinc-700/30 rounded-full blur-md -z-10"></div>
          )}
        </motion.button>

        {/* HFT Panel Tab */}
        <motion.button
          onClick={() => {
            if (isDrawerOpen && activeTab === "hft-panel") {
              onClose();
            } else {
              onTabClick("hft-panel");
            }
          }}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-full text-sm ${
            isDrawerOpen && activeTab === "hft-panel"
              ? 'text-white shadow-lg'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Active Tab Background */}
          {isDrawerOpen && activeTab === "hft-panel" && (
            <motion.div
              layoutId="activeFooterTab"
              className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          <div className="relative flex items-center gap-1.5">
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
              className={`transition-all duration-300 ${
                isDrawerOpen && activeTab === "hft-panel" ? 'text-white scale-110' : 'text-zinc-400'
              }`}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <span className="font-medium">HFT Panel</span>
          </div>

          {/* Active Tab Glow Effect */}
          {isDrawerOpen && activeTab === "hft-panel" && (
            <div className="absolute inset-0 bg-zinc-700/30 rounded-full blur-md -z-10"></div>
          )}
        </motion.button>

        {/* Stocks Screener Tab */}
        <motion.button
          onClick={() => {
            if (isDrawerOpen && activeTab === "stocks-screener") {
              onClose();
            } else {
              onTabClick("stocks-screener");
            }
          }}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 rounded-full text-sm ${
            isDrawerOpen && activeTab === "stocks-screener"
              ? 'text-white shadow-lg'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Active Tab Background */}
          {isDrawerOpen && activeTab === "stocks-screener" && (
            <motion.div
              layoutId="activeFooterTab"
              className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          <div className="relative flex items-center gap-1.5">
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
              className={`transition-all duration-300 ${
                isDrawerOpen && activeTab === "stocks-screener" ? 'text-white scale-110' : 'text-zinc-400'
              }`}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="21 21l-4.35-4.35"></path>
            </svg>
            <span className="font-medium">Stocks Screener</span>
          </div>

          {/* Active Tab Glow Effect */}
          {isDrawerOpen && activeTab === "stocks-screener" && (
            <div className="absolute inset-0 bg-zinc-700/30 rounded-full blur-md -z-10"></div>
          )}
        </motion.button>
      </div>
    </footer>
  );
}
