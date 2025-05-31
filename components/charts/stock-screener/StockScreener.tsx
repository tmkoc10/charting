"use client";

import { useState } from "react";
import { ChevronDown, Minus, X } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { TabType } from "./types";
import { mockStockData } from "./mockData";
import { FilterBar } from "./FilterBar";
import { TabNavigation } from "./TabNavigation";
import { StockTable } from "./StockTable";

export function StockScreener() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filteredData] = useState(mockStockData);
  // const [filteredData, setFilteredData] = useState(mockStockData);

  // const handleFilterChange = (_filters: Record<string, string>) => {
  //   // Apply filters to data
  //   // For now, just use mock data
  //   setFilteredData(mockStockData);
  // };

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
          {/* Left side - Title dropdown */}
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'text-white hover:text-zinc-300'
                : 'text-black hover:text-zinc-700'
            }`}>
              <span className="font-medium text-sm">Stock Screener</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Right side - Window controls */}
          <div className="flex items-center gap-1">
            <button className={`p-1.5 rounded transition-colors ${
              theme === 'dark' ? 'hover:bg-zinc-700' : 'hover:bg-zinc-200'
            }`}>
              <Minus className={`w-3 h-3 ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              }`} />
            </button>
            <button className={`p-1.5 rounded transition-colors ${
              theme === 'dark' ? 'hover:bg-zinc-700' : 'hover:bg-zinc-200'
            }`}>
              <X className={`w-3 h-3 ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Data Table */}
      <StockTable data={filteredData} />
    </div>
  );
}
