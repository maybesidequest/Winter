import { MessageOutlined } from "@ant-design/icons";
import { hasSettingsFlag } from "~/schemas/hub";
import type { HubResource } from "~/resources/hub";
import {
  DashboardReadOnlyNotice,
  DashboardSectionCard,
  DashboardSectionTitle,
  DepthToggle,
} from "./shared";
import { HubBadgesPanel } from "./HubBadgesPanel";

interface HubChatExperiencePanelProps {
  hub: HubResource;
  canEdit: boolean;
  isSaving?: boolean;
  onToggleFlag: (flag: string, enabled: boolean) => void;
}

const CHAT_TOGGLES = [
  {
    flag: "REACTIONS" as const,
    label: "Cross-Server Reactions",
    desc: "Synchronize emoji reactions between connected channels across different servers.",
  },
  {
    flag: "USE_NICKNAMES" as const,
    label: "Display Server Nicknames",
    desc: "Forward messages with server-specific nicknames instead of global Discord account handles.",
  },
];

export function HubChatExperiencePanel({
  hub,
  canEdit,
  isSaving = false,
  onToggleFlag,
}: HubChatExperiencePanelProps) {
  const settings = hub.spec.settings;

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      <DashboardSectionCard
        title={
          <DashboardSectionTitle>
            <div className="flex items-center gap-2">
              <MessageOutlined className="text-violet-400 text-sm" />
              <span>Relay Behaviors</span>
            </div>
          </DashboardSectionTitle>
        }
      >
        {!canEdit && (
          <DashboardReadOnlyNotice message="Only Hub managers can change message and reaction relay behaviors." />
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-col pb-1">
            <span className="text-xs font-bold text-white/90 uppercase tracking-wide">
              Cross-Server Interactions
            </span>
            <span className="text-xs text-white/60">
              Formatting, identities, and social reactions for relayed community chat.
            </span>
          </div>

          <div className="flex flex-col divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-[#181726] px-3 py-1 shadow-[0_1.5px_0_0_rgba(255,255,255,0.06)]">
            {CHAT_TOGGLES.map(({ flag, label, desc }) => {
              const isChecked = hasSettingsFlag(settings, flag);
              return (
                <label
                  key={flag}
                  className="flex items-center justify-between py-3 px-2 hover:bg-[#1d1b2e] rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-white block">{label}</span>
                    <span className="text-xs text-white/60 block leading-normal">
                      {desc}
                    </span>
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
      </DashboardSectionCard>

      <HubBadgesPanel hub={hub} canEdit={canEdit} />
    </div>
  );
}

