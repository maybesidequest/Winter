import { TagOutlined } from "@ant-design/icons";
import type { HubTagResource } from "~/resources/hubDiscovery";

interface HubTagPillsProps {
  tags: HubTagResource[];
  selectedTags: string[];
  onToggleTag: (tagName: string) => void;
  onClearTags: () => void;
}

const DEFAULT_FEATURED_CATEGORIES = [
  "Gaming",
  "Tech",
  "Art",
  "Social",
  "Music",
  "Anime",
  "Study",
  "Memes",
];

export function HubTagPills({
  tags,
  selectedTags,
  onToggleTag,
  onClearTags,
}: HubTagPillsProps) {
  // Combine official/popular tags with fallback defaults
  const displayTags = tags.length > 0
    ? tags
    : DEFAULT_FEATURED_CATEGORIES.map((name) => ({ id: name, name }));

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
      <button
        type="button"
        onClick={onClearTags}
        className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
          selectedTags.length === 0
            ? "bg-violet-500 text-white font-semibold shadow-[0_0_12px_rgba(139,92,246,0.35)]"
            : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
        }`}
      >
        <TagOutlined className="text-[10px]" />
        <span>All Categories</span>
      </button>

      {displayTags.map((t) => {
        const isSelected = selectedTags.includes(t.name);
        return (
          <button
            key={t.id || t.name}
            type="button"
            onClick={() => onToggleTag(t.name)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              isSelected
                ? "bg-violet-500/20 text-violet-200 border border-violet-400/50 shadow-[0_0_10px_rgba(139,92,246,0.2)] font-semibold"
                : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
            }`}
          >
            #{t.name}
          </button>
        );
      })}
    </div>
  );
}

