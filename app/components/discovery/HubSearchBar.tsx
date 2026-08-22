import { useState, useEffect, useRef } from "react";
import {
  SearchOutlined,
  CloseCircleFilled,
  FilterOutlined,
  DownOutlined,
  CheckOutlined,
} from "@ant-design/icons";
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

const SORT_OPTIONS: Array<{ value: HubDiscoverySort; label: string; icon: string }> = [
  { value: "trending", label: "Trending (Velocity)", icon: "🔥" },
  { value: "upvotes", label: "Top Voted (Monthly)", icon: "▲" },
  { value: "active", label: "Most Active (24h)", icon: "⚡" },
  { value: "growing", label: "Fastest Growing", icon: "📈" },
  { value: "rating", label: "Highest Rated", icon: "★" },
  { value: "popular", label: "Largest Bridges", icon: "🌐" },
  { value: "newest", label: "Recently Added", icon: "✨" },
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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close sort dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen]);

  const currentSortOption = SORT_OPTIONS.find((opt) => opt.value === sort) || SORT_OPTIONS[0];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
      {/* Search Input with Tactile Bottom Drop Shadow */}
      <div className="relative flex-1">
        <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by hub name, topic, or description..."
          className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] hover:border-white/20 focus:border-violet-500/60 focus:bg-white/[0.06] text-white placeholder-white/40 text-xs transition-all outline-none shadow-[0_1.5px_0_0_rgba(255,255,255,0.12)] focus:shadow-[0_2px_0_0_rgba(129,117,238,0.5),0_0_0_2px_rgba(129,117,238,0.15)]"
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
        {/* Custom Glassmorphic Sort Dropdown */}
        <div className="relative" ref={sortDropdownRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              isSortOpen
                ? "bg-white/[0.08] border-violet-400/50 text-white shadow-[0_0.5px_0_0_rgba(129,117,238,0.5)] translate-y-[1px]"
                : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.12] hover:border-white/20 text-white/80 hover:text-white shadow-[0_1.5px_0_0_rgba(255,255,255,0.12)] hover:shadow-[0_2.5px_0_0_rgba(255,255,255,0.18)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_0.5px_0_0_rgba(255,255,255,0.12)]"
            }`}
          >
            <FilterOutlined className="text-white/40 text-xs" />
            <span className="flex items-center gap-1.5 font-['Sora']">
              <span>{currentSortOption.icon}</span>
              <span>{currentSortOption.label}</span>
            </span>
            <DownOutlined
              className={`text-[10px] text-white/40 ml-0.5 transition-transform duration-200 ${
                isSortOpen ? "rotate-180 text-violet-300" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu Popup with Drop Shadow Border Design */}
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 z-50 p-1.5 dashboard-dropdown-panel animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white/40 border-b border-white/[0.06] mb-1">
                Sort Directory By
              </div>
              <div className="flex flex-col gap-0.5">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = opt.value === sort;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-violet-500/20 text-violet-200 font-semibold border border-violet-400/40 shadow-[0_1px_0_0_rgba(129,117,238,0.3)]"
                          : "text-white/70 hover:text-white hover:bg-white/[0.07] border border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <span className="text-sm leading-none">{opt.icon}</span>
                        <span>{opt.label.replace(/^[^\s]+\s/, "")}</span>
                      </span>
                      {isSelected && (
                        <CheckOutlined className="text-violet-400 text-xs flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* NSFW Toggle Container with Tactile Bottom Drop Shadow */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.12] rounded-xl px-3 py-1.5 shadow-[0_1.5px_0_0_rgba(255,255,255,0.12)]">
          <span className="text-[11px] font-semibold text-white/60">18+ NSFW</span>
          <DepthToggle checked={nsfw} onChange={onNsfwChange} />
        </div>
      </div>
    </div>
  );
}


