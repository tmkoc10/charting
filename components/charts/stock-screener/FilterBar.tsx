"use client";

import { ChevronDown, Plus, MoreHorizontal } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { FilterOption } from "./types";
import { filterOptions, secondaryFilterOptions } from "./mockData";

interface FilterBarProps {
  onFilterChange?: (filters: Record<string, string>) => void;
}

export function FilterBar({}: FilterBarProps) {
  const { theme } = useTheme();
  // const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const handleFilterClick = (filterValue: string) => {
    // Toggle filter or show dropdown
    console.log(`Filter clicked: ${filterValue}`);
  };

  const FilterButton = ({ option, showFlag = false }: { option: FilterOption; showFlag?: boolean }) => (
    <button
      onClick={() => handleFilterClick(option.value)}
      className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors whitespace-nowrap min-w-fit ${
        theme === 'dark'
          ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white'
          : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-black'
      }`}
    >
      {showFlag && (
        <div className="w-4 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">US</span>
        </div>
      )}
      <span>{option.label}</span>
      <ChevronDown className={`w-3 h-3 ${
        theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
      }`} />
    </button>
  );

  return (
    <div className={`border-b ${
      theme === 'dark'
        ? 'bg-zinc-900 border-zinc-700'
        : 'bg-zinc-100 border-zinc-300'
    }`}>
      {/* Primary Filter Bar */}
      <div className={`px-4 py-2.5 border-b ${
        theme === 'dark' ? 'border-zinc-800' : 'border-zinc-300'
      }`}>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {filterOptions.map((option, index) => (
            <FilterButton
              key={option.value}
              option={option}
              showFlag={index === 1} // Show US flag for Market filter
            />
          ))}
        </div>
      </div>

      {/* Secondary Filter Bar */}
      <div className="px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {secondaryFilterOptions.map((option) => (
            <FilterButton key={option.value} option={option} />
          ))}

          {/* Add Filter Button */}
          <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors min-w-fit ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600 text-zinc-300'
              : 'bg-zinc-200 hover:bg-zinc-300 border-zinc-400 text-zinc-700'
          }`}>
            <Plus className="w-3 h-3" />
          </button>

          {/* More Options Button */}
          <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors min-w-fit ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600 text-zinc-300'
              : 'bg-zinc-200 hover:bg-zinc-300 border-zinc-400 text-zinc-700'
          }`}>
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
