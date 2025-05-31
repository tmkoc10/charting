"use client";

import { useTheme } from "@/lib/theme-context";
import { TradeRecord } from "./types";

interface TradesListProps {
  trades: TradeRecord[];
}

export function TradesList({ trades }: TradesListProps) {
  const { theme } = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
  };

  // Show only first 50 trades for performance
  const displayTrades = trades.slice(0, 50);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}>Trade History</h3>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          Showing {displayTrades.length} of {trades.length} trades
        </p>
      </div>

      <div className={`rounded-lg overflow-hidden ${
        theme === 'dark'
          ? 'bg-zinc-900 border border-zinc-700'
          : 'bg-zinc-100 border border-zinc-300'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`border-b ${
              theme === 'dark'
                ? 'bg-zinc-800 border-zinc-700'
                : 'bg-zinc-200 border-zinc-300'
            }`}>
              <tr>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Trade #</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Symbol</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Side</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Entry</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Exit</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Qty</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>P&L</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>P&L %</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Duration</th>
                <th className={`text-left py-3 px-4 text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>Entry Time</th>
              </tr>
            </thead>
            <tbody>
              {displayTrades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`border-b transition-colors ${
                    theme === 'dark'
                      ? 'border-zinc-800 hover:bg-zinc-800/50'
                      : 'border-zinc-300 hover:bg-zinc-200/50'
                  }`}
                >
                  <td className={`py-3 px-4 ${
                    theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>#{index + 1}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>{trade.symbol}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.side === 'long'
                        ? (theme === 'dark'
                          ? 'bg-green-900/30 text-green-400 border border-green-700'
                          : 'bg-green-100 text-green-700 border border-green-300')
                        : (theme === 'dark'
                          ? 'bg-red-900/30 text-red-400 border border-red-700'
                          : 'bg-red-100 text-red-700 border border-red-300')
                    }`}>
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className={`py-3 px-4 ${
                    theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>
                    {formatCurrency(trade.entryPrice)}
                  </td>
                  <td className={`py-3 px-4 ${
                    theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>
                    {formatCurrency(trade.exitPrice)}
                  </td>
                  <td className={`py-3 px-4 ${
                    theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>{trade.quantity}</td>
                  <td className={`py-3 px-4 font-medium ${
                    trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(trade.pnl)}
                  </td>
                  <td className={`py-3 px-4 font-medium ${
                    trade.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatPercent(trade.pnlPercent)}
                  </td>
                  <td className={`py-3 px-4 ${
                    theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>
                    {formatDuration(trade.duration)}
                  </td>
                  <td className={`py-3 px-4 text-xs ${
                    theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {formatDate(trade.entryTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {trades.length > 50 && (
        <div className="text-center">
          <button className={`px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
              : 'bg-zinc-200 hover:bg-zinc-300 text-black'
          }`}>
            Load More Trades
          </button>
        </div>
      )}
    </div>
  );
}
