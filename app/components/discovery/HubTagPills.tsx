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
    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
      <button
        type="button"
        onClick={onClearTags}
        className={`dashboard-pill-btn flex items-center gap-1.5 ${
          selectedTags.length === 0 ? "dashboard-pill-btn--active" : ""
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
            className={`dashboard-pill-btn ${
              isSelected ? "dashboard-pill-btn--selected" : ""
            }`}
          >
            #{t.name}
          </button>
        );
      })}
    </div>
  );
}

