"use client";

import { useTheme } from "@/lib/theme-context";
import { TabType } from "./types";
import { tabConfig } from "./mockData";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { theme } = useTheme();

  return (
    <div className={`border-b ${
      theme === 'dark'
        ? 'bg-black border-zinc-700'
        : 'bg-white border-zinc-300'
    }`}>
      <div className="px-4 py-0">
        <div className={`flex items-center gap-0 overflow-x-auto scrollbar-thin scrollbar-track-transparent ${
          theme === 'dark' ? 'scrollbar-thumb-zinc-600' : 'scrollbar-thumb-zinc-400'
        }`}>
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? (theme === 'dark'
                      ? 'text-white border-white'
                      : 'text-black border-black')
                  : (theme === 'dark'
                      ? 'text-zinc-400 border-transparent hover:text-zinc-300 hover:border-zinc-600'
                      : 'text-zinc-600 border-transparent hover:text-zinc-700 hover:border-zinc-400')
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
