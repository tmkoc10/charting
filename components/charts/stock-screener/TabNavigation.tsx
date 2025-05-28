"use client";

import { TabType } from "./types";
import { tabConfig } from "./mockData";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-black border-b border-zinc-700">
      <div className="px-4 py-0">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white border-white'
                  : 'text-zinc-400 border-transparent hover:text-zinc-300 hover:border-zinc-600'
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
