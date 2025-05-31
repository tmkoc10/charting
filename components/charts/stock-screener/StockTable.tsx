"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { StockData, SortConfig } from "./types";

interface StockTableProps {
  data: StockData[];
}

export function StockTable({ data }: StockTableProps) {
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof StockData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const SortIcon = ({ column }: { column: keyof StockData }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className={`w-3 h-3 ${
        theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'
      }`} />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className={`w-3 h-3 ${
          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
        }`} />
      : <ChevronDown className={`w-3 h-3 ${
          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
        }`} />;
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const formatChange = (change: number, isPercent: boolean = false) => {
    const formatted = isPercent ? `${formatNumber(change)}%` : formatNumber(change);
    const colorClass = change >= 0 ? 'text-green-400' : 'text-red-400';
    const sign = change >= 0 ? '+' : '';
    return <span className={colorClass}>{sign}{formatted}</span>;
  };

  return (
    <div className={`flex-1 overflow-auto ${
      theme === 'dark' ? 'bg-black' : 'bg-white'
    }`}>
      <table className="w-full min-w-[1200px]">
        <thead className={`sticky top-0 border-b z-10 ${
          theme === 'dark'
            ? 'bg-zinc-900 border-zinc-700'
            : 'bg-zinc-100 border-zinc-300'
        }`}>
          <tr>
            <th
              className={`text-left py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('symbol')}
            >
              <div className="flex items-center gap-1">
                Symbol
                <SortIcon column="symbol" />
              </div>
            </th>
            <th
              className={`text-left py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('companyName')}
            >
              <div className="flex items-center gap-1">
                Company Name
                <SortIcon column="companyName" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center justify-end gap-1">
                Price
                <SortIcon column="price" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('changePercent')}
            >
              <div className="flex items-center justify-end gap-1">
                Change %
                <SortIcon column="changePercent" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('volume')}
            >
              <div className="flex items-center justify-end gap-1">
                Volume
                <SortIcon column="volume" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('relVolume')}
            >
              <div className="flex items-center justify-end gap-1">
                Rel Volume
                <SortIcon column="relVolume" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('marketCap')}
            >
              <div className="flex items-center justify-end gap-1">
                Market cap
                <SortIcon column="marketCap" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('pe')}
            >
              <div className="flex items-center justify-end gap-1">
                P/E
                <SortIcon column="pe" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('eps')}
            >
              <div className="flex items-center justify-end gap-1">
                EPS dil TTM
                <SortIcon column="eps" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('epsGrowth')}
            >
              <div className="flex items-center justify-end gap-1">
                EPS dil growth TTM YoY
                <SortIcon column="epsGrowth" />
              </div>
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('divYield')}
            >
              <div className="flex items-center justify-end gap-1">
                Div yield % TTM
                <SortIcon column="divYield" />
              </div>
            </th>
            <th
              className={`text-left py-3 px-4 text-xs font-medium cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-700'
              }`}
              onClick={() => handleSort('sector')}
            >
              <div className="flex items-center gap-1">
                Sector
                <SortIcon column="sector" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((stock) => (
            <tr
              key={stock.symbol}
              className={`border-b transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'border-zinc-800 hover:bg-zinc-900/50'
                  : 'border-zinc-300 hover:bg-zinc-100/50'
              }`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shadow-sm ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-zinc-600 to-zinc-700 text-white'
                      : 'bg-gradient-to-br from-zinc-300 to-zinc-400 text-black'
                  }`}>
                    {stock.symbol.charAt(0)}
                  </div>
                  <span className={`font-medium text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>{stock.symbol}</span>
                </div>
              </td>
              <td className={`py-3 px-4 text-sm max-w-[200px] truncate ${
                theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
              }`}>{stock.companyName}</td>
              <td className={`py-3 px-4 text-right font-medium text-sm ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>${formatNumber(stock.price)}</td>
              <td className="py-3 px-4 text-right text-sm font-medium">{formatChange(stock.changePercent, true)}</td>
              <td className={`py-3 px-4 text-right text-sm ${
                theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
              }`}>{stock.volume}</td>
              <td className={`py-3 px-4 text-right text-sm ${
                theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
              }`}>{formatNumber(stock.relVolume)}</td>
              <td className={`py-3 px-4 text-right text-sm font-medium ${
                theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
              }`}>{stock.marketCap}</td>
              <td className={`py-3 px-4 text-right text-sm ${
                theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
              }`}>{formatNumber(stock.pe)}</td>
              <td className={`py-3 px-4 text-right text-sm ${
                theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
              }`}>{formatNumber(stock.eps)}</td>
              <td className="py-3 px-4 text-right text-sm font-medium">{formatChange(stock.epsGrowth, true)}</td>
              <td className={`py-3 px-4 text-right text-sm ${
                theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
              }`}>{formatNumber(stock.divYield)}%</td>
              <td className="py-3 px-4">
                <span className={`cursor-pointer text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}>
                  {stock.sector}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
