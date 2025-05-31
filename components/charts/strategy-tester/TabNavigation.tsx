"use client";

import { useTheme } from "@/lib/theme-context";
import { TabType } from "./types";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'performance', label: 'Performance' },
  { id: 'trades-analysis', label: 'Trades analysis' },
  { id: 'risk-ratios', label: 'Risk/performance ratios' },
  { id: 'trades-list', label: 'List of trades' }
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === tab.id
              ? (theme === 'dark'
                  ? 'bg-white text-black'
                  : 'bg-black text-white')
              : (theme === 'dark'
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                  : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 hover:text-black')
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
