import { HubSettingsFlags, hasSettingsFlag } from "~/schemas/hub";
import { DashboardReadOnlyNotice, DashboardSectionCard, DashboardSectionTitle, DepthToggle } from "./shared";

type ToggleConfig = {
  flag: keyof typeof HubSettingsFlags;
  label: string;
  desc: string;
};

const MODULE_CATEGORIES: { category: string; desc: string; toggles: ToggleConfig[] }[] = [
  {
    category: "Safety & Filters",
    desc: "Automated filters that inspect and guard relayed messages.",
    toggles: [
      { flag: "SPAM_FILTER", label: "Spam Filter", desc: "Automatically block repeated messages and high-velocity spam." },
      { flag: "BLOCK_INVITES", label: "Block Server Invites", desc: "Prevent Discord server invite links from being forwarded across bridges." },
      { flag: "HIDE_LINKS", label: "Hide External Links", desc: "Strip all web URLs and hyperlinks from relayed messages." },
      { flag: "BLOCK_NSFW", label: "Block NSFW Images", desc: "Detect and drop explicit image attachments using machine vision." },
    ],
  },
  {
    category: "Media & Attachments",
    desc: "Control which rich media types are relayed between servers.",
    toggles: [
      { flag: "ALLOW_VIDEOS", label: "Allow Videos", desc: "Forward MP4, MOV, and WebM video uploads across connected servers." },
      { flag: "BLOCK_ATTACHMENTS", label: "Block All Files", desc: "Prevent any files or image attachments from being broadcast." },
      { flag: "BLOCK_TENOR_GIFS", label: "Block Tenor GIFs", desc: "Prevent Tenor and Giphy GIF links from expanding." },
    ],
  },
  {
    category: "Chat Experience",
    desc: "Formatting and social interactions for relayed community talk.",
    toggles: [
      { flag: "REACTIONS", label: "Cross-Server Reactions", desc: "Enable emoji reactions to synchronize across connected channels." },
      { flag: "USE_NICKNAMES", label: "Display Nicknames", desc: "Forward messages with server-specific nicknames instead of global Discord handles." },
    ],
  },
];

type HubSettingsPanelProps = {
  settings: number;
  canEdit: boolean;
  isSaving?: boolean;
  onToggleFlag: (flag: string, enabled: boolean) => void;
};

export function HubSettingsPanel({ settings, canEdit, isSaving = false, onToggleFlag }: HubSettingsPanelProps) {
  return (
    <DashboardSectionCard title={<DashboardSectionTitle>Hub Modules</DashboardSectionTitle>}>
      {!canEdit && <DashboardReadOnlyNotice message="Only Hub managers can change message and attachment modules." />}

      <div className="flex flex-col gap-6">
        {MODULE_CATEGORIES.map(({ category, desc, toggles }) => (
          <div key={category} className="flex flex-col gap-2">
            <div className="flex flex-col pb-1">
              <span className="text-xs font-bold text-white/90 uppercase tracking-wide">{category}</span>
              <span className="text-[11px] text-white/60">{desc}</span>
            </div>

            <div className="flex flex-col divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-1">
              {toggles.map(({ flag, label, desc: itemDesc }) => {
                const isChecked = hasSettingsFlag(settings, flag);
                return (
                  <label
                    key={flag}
                    className="flex items-center justify-between py-3 px-1.5 hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5 pr-4">
                      <span className="text-xs font-bold text-white block">{label}</span>
                      <span className="text-[11px] text-white/60 block leading-normal">{itemDesc}</span>
                    </div>
                    <DepthToggle
                      checked={isChecked}
                      onChange={(checked) => onToggleFlag(flag, checked)}
                      disabled={!canEdit || isSaving}
                      aria-label={label}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DashboardSectionCard>
  );
}
