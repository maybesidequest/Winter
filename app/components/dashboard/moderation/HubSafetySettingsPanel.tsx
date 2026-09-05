import { SafetyCertificateOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { dashboardGlassCardStyle, DepthToggle } from "~/components/dashboard/shared";
import type { HubSafetySettings } from "~/services/control/moderation.shared";
import {
  ALL_SAFETY_KEYS,
  SAFETY_CATEGORIES,
  type SafetySettingKey,
} from "./safetyCategories";

interface HubSafetySettingsPanelProps {
  settings: HubSafetySettings;
  canEdit: boolean;
  saving?: boolean;
  onSave: (
    settings: Partial<HubSafetySettings["spec"]>,
    updateMask: Array<SafetySettingKey>,
    expectedVersion: number
  ) => void;
}

export function HubSafetySettingsPanel({
  settings,
  canEdit,
  saving = false,
  onSave,
}: HubSafetySettingsPanelProps) {
  const [draft, setDraft] = useState(settings.spec);

  // Sync on resource version to avoid overwriting mid-edit while keeping authoritative
  useEffect(() => {
    setDraft(settings.spec);
  }, [settings.version]);

  const changedKeys = ALL_SAFETY_KEYS.filter((key) => draft[key] !== settings.spec[key]);
  const hasChanges = changedKeys.length > 0;

  const handleToggle = (key: SafetySettingKey, value: boolean) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleReset = () => {
    setDraft(settings.spec);
  };

  const handleSave = () => {
    if (!hasChanges || saving) return;
    onSave(draft, changedKeys, settings.version);
  };

  return (
    <section className="rounded-2xl border p-6 flex flex-col gap-6" style={dashboardGlassCardStyle}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-base">
            <SafetyCertificateOutlined />
          </div>
          <div>
            <h3 className="text-base font-bold text-white m-0 font-['Sora']">
              Hub Safety Policies
            </h3>
            <p className="text-xs text-white/60 m-0 mt-0.5">
              Automated content sanitization, anti-spam filters, and cross-server media relay rules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="dashboard-btn-secondary !min-h-[32px] !px-3 !py-1 !text-xs !font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <UndoOutlined className="text-xs" />
              <span>Reset</span>
            </button>
          )}

          {canEdit && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="dashboard-btn-primary !min-h-[32px] !px-4 !py-1 !text-xs !font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <SaveOutlined className="text-xs" />
              <span>{saving ? "Saving…" : "Save Policies"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Categorized Settings Grid */}
      <div className="flex flex-col gap-6">
        {SAFETY_CATEGORIES.map((category) => (
          <div key={category.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">{category.icon}</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 m-0">
                {category.title}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.items.map((item) => {
                const isChecked = Boolean(draft[item.key]);
                const isModified = draft[item.key] !== settings.spec[item.key];

                return (
                  <div
                    key={item.key}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isModified
                        ? "bg-violet-950/40 border-violet-500/40 shadow-[0_0_12px_rgba(129,117,238,0.15)]"
                        : "bg-[#181726] border-white/[0.06] hover:border-white/15"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <label
                          htmlFor={`toggle-${item.key}`}
                          className="text-xs font-bold text-white cursor-pointer select-none"
                        >
                          {item.label}
                        </label>
                        {isModified && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[#8175ee]"
                            title="Modified setting"
                          />
                        )}
                      </div>
                      <p className="text-xs text-white/60 m-0 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 pt-0.5">
                      <DepthToggle
                        id={`toggle-${item.key}`}
                        checked={isChecked}
                        disabled={!canEdit || saving}
                        onChange={(checked) => handleToggle(item.key, checked)}
                        aria-label={item.label}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {settings.updatedAt && (
        <div className="pt-2 text-right border-t border-white/[0.04]">
          <span className="text-xs text-white/40">
            Last policy update: {new Date(settings.updatedAt).toLocaleString()}
          </span>
        </div>
      )}
    </section>
  );
}
