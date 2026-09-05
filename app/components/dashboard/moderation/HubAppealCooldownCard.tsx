import { ClockCircleOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";
import { useState } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";

interface HubAppealCooldownCardProps {
  hub: HubResource;
  canEdit: boolean;
  isSaving: boolean;
  onSaveConfig?: (changes: Partial<PatchHubConfigInput>) => void;
}

const PRESETS = [
  { label: "24h (1d)", hours: 24 },
  { label: "72h (3d)", hours: 72 },
  { label: "168h (7d · Standard)", hours: 168 },
  { label: "336h (14d)", hours: 336 },
  { label: "720h (30d)", hours: 720 },
];

export function HubAppealCooldownCard({ hub, canEdit, isSaving, onSaveConfig }: HubAppealCooldownCardProps) {
  const initialCooldown = hub.spec.appealCooldownHours ?? 168;
  const [appealCooldown, setAppealCooldown] = useState<number>(initialCooldown);
  const isModified = appealCooldown !== initialCooldown;

  const handleSave = () => {
    if (onSaveConfig && canEdit && !isSaving) {
      onSaveConfig({ appealCooldownHours: appealCooldown });
    }
  };

  const days = Math.round(((appealCooldown || 0) / 24) * 10) / 10;

  return (
    <section className="rounded-2xl border p-6 flex flex-col gap-4" style={dashboardGlassCardStyle}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 text-sm">
            <ClockCircleOutlined />
          </div>
          <div>
            <h3 className="text-base font-bold text-white m-0 font-['Sora']">Appeal Cooldown Window</h3>
            <p className="text-xs text-white/60 m-0 mt-0.5">
              Minimum wait time required before a sanctioned member can submit a new infraction appeal.
            </p>
          </div>
        </div>

        {canEdit && onSaveConfig && (
          <div className="flex items-center gap-2">
            {isModified && (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setAppealCooldown(initialCooldown)}
                className="dashboard-btn-secondary !min-h-[32px] !px-3 !py-1 !text-xs !font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <UndoOutlined className="text-xs" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              disabled={isSaving || !isModified}
              onClick={handleSave}
              className="dashboard-btn-primary !min-h-[32px] !px-4 !py-1 !text-xs !font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <SaveOutlined className="text-xs" />
              <span>{isSaving ? "Saving…" : "Save Cooldown"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="hub-cooldown-input" className="sr-only">Cooldown hours</label>
            <input
              id="hub-cooldown-input"
              type="number"
              min={0}
              max={8760}
              value={appealCooldown}
              disabled={!canEdit || isSaving}
              onChange={(e) => setAppealCooldown(Math.max(0, Number(e.target.value)))}
              className="dashboard-input text-sm w-32 font-mono"
            />
            <span className="text-xs text-white/80 font-medium">hours</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[#181726] border border-white/[0.08] text-xs text-violet-300 font-semibold">
            {days} {days === 1 ? "day" : "days"} cooldown
          </div>
        </div>

        {/* Preset Quick Selectors */}
        {canEdit && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-white/50">Quick presets:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.hours}
                type="button"
                onClick={() => setAppealCooldown(preset.hours)}
                disabled={!canEdit || isSaving}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  appealCooldown === preset.hours
                    ? "bg-violet-500/20 text-violet-200 border border-violet-500/40 shadow-[0_1px_0_0_rgba(129,117,238,0.3)]"
                    : "bg-[#181726] text-white/70 border border-white/[0.08] hover:border-white/20 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

