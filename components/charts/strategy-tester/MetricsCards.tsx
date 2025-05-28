"use client";

import { Info } from "lucide-react";
import { StrategyMetrics } from "./types";

interface MetricsCardsProps {
  metrics: StrategyMetrics;
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  isPositive?: boolean;
  showInfo?: boolean;
}

function MetricCard({ title, value, subtitle, isPositive, showInfo = true }: MetricCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 flex-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-zinc-400 text-xs font-medium">{title}</h3>
        {showInfo && (
          <Info className="w-3 h-3 text-zinc-500 hover:text-zinc-400 cursor-pointer" />
        )}
      </div>
      <div className="space-y-1">
        <div className={`text-lg font-bold ${
          isPositive === true ? 'text-green-400' : 
          isPositive === false ? 'text-red-400' : 
          'text-white'
        }`}>
          {value}
        </div>
        {subtitle && (
          <div className={`text-xs ${
            isPositive === true ? 'text-green-400' : 
            isPositive === false ? 'text-red-400' : 
            'text-zinc-400'
          }`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="flex gap-4 mb-6">
      <MetricCard
        title="Total P&L"
        value={formatCurrency(metrics.totalPnL)}
        subtitle={formatPercent(metrics.totalPnLPercent)}
        isPositive={metrics.totalPnL > 0}
      />
      
      <MetricCard
        title="Max equity drawdown"
        value={formatCurrency(metrics.maxDrawdown)}
        subtitle={`${metrics.maxDrawdownPercent.toFixed(2)}%`}
        isPositive={false}
      />
      
      <MetricCard
        title="Total trades"
        value={formatNumber(metrics.totalTrades)}
      />
      
      <MetricCard
        title="Profitable trades"
        value={`${metrics.winRate.toFixed(2)}%`}
        subtitle={`${metrics.profitableTrades}/${metrics.totalTrades - metrics.profitableTrades}`}
        isPositive={metrics.winRate > 50}
      />
      
      <MetricCard
        title="Profit factor"
        value={metrics.profitFactor.toFixed(2)}
        isPositive={metrics.profitFactor > 1}
      />
    </div>
  );
}
