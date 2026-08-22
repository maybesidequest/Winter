import { useState, useEffect } from "react";
import { SearchOutlined, CloseCircleFilled, FireOutlined, FilterOutlined } from "@ant-design/icons";
import { DepthToggle } from "~/components/dashboard/shared";
import type { HubDiscoverySort } from "~/schemas/hubDiscovery";

interface HubSearchBarProps {
  search: string;
  sort: HubDiscoverySort;
  nsfw: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (sort: HubDiscoverySort) => void;
  onNsfwChange: (nsfw: boolean) => void;
}

const SORT_OPTIONS: Array<{ value: HubDiscoverySort; label: string }> = [
  { value: "trending", label: "🔥 Trending (Velocity)" },
  { value: "upvotes", label: "▲ Top Voted (Monthly)" },
  { value: "active", label: "⚡ Most Active (24h)" },
  { value: "growing", label: "📈 Fastest Growing" },
  { value: "rating", label: "★ Highest Rated" },
  { value: "popular", label: "🌐 Largest Bridges" },
  { value: "newest", label: "✨ Recently Added" },
];

export function HubSearchBar({
  search,
  sort,
  nsfw,
  onSearchChange,
  onSortChange,
  onNsfwChange,
}: HubSearchBarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search input
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by hub name, topic, or description..."
          className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-violet-500/50 text-white placeholder-white/40 text-xs transition-all outline-none"
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch("");
              onSearchChange("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
          >
            <CloseCircleFilled className="text-xs" />
          </button>
        )}
      </div>

      {/* Controls: Sort & NSFW */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white/70">
          <FilterOutlined className="text-white/40 text-xs" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as HubDiscoverySort)}
            className="bg-transparent text-white text-xs outline-none cursor-pointer pr-1 font-medium"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#18181f] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* NSFW Toggle */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5">
          <span className="text-[11px] font-semibold text-white/60">18+ NSFW</span>
          <DepthToggle checked={nsfw} onChange={onNsfwChange} />
        </div>
      </div>
    </div>
  );
}

