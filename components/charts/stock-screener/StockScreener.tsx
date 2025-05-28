"use client";

import { useState } from "react";
import { ChevronDown, Minus, X } from "lucide-react";
import { TabType } from "./types";
import { mockStockData } from "./mockData";
import { FilterBar } from "./FilterBar";
import { TabNavigation } from "./TabNavigation";
import { StockTable } from "./StockTable";

export function StockScreener() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filteredData] = useState(mockStockData);
  // const [filteredData, setFilteredData] = useState(mockStockData);

  // const handleFilterChange = (_filters: Record<string, string>) => {
  //   // Apply filters to data
  //   // For now, just use mock data
  //   setFilteredData(mockStockData);
  // };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header Section */}
      <div className="bg-zinc-900 border-b border-zinc-700 px-4 py-2.5 h-[38px] flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Left side - Title dropdown */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-white hover:text-zinc-300 transition-colors">
              <span className="font-medium text-sm">Stock Screener</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Right side - Window controls */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-zinc-700 rounded transition-colors">
              <Minus className="w-3 h-3 text-zinc-400" />
            </button>
            <button className="p-1.5 hover:bg-zinc-700 rounded transition-colors">
              <X className="w-3 h-3 text-zinc-400" />
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
