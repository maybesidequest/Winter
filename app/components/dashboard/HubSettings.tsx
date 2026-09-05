import { useEffect, useState } from "react";
import { GlobalOutlined, CheckOutlined } from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { HubLifecyclePanel, type LifecycleFailure } from "~/components/dashboard/HubLifecyclePanel";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput, HubVisibilityType } from "~/schemas/hub";
import type { LifecycleAction } from "~/services/lifecycleIntent";

interface HubSettingsProps {
  hub: HubResource;
  canEdit: boolean;
  isOwner?: boolean;
  canLockdown: boolean;
  saving: boolean;
  onSave: (changes: Partial<PatchHubConfigInput>) => void;
  pendingLifecycleAction?: LifecycleAction;
  lifecycleFailure?: LifecycleFailure;
  onLockdownHub: (locked: boolean, reason: string) => void;
  onDeleteHub?: (confirmationName: string) => void;
  onTransferOwnership?: (newOwnerId: string) => void;
  onRefreshLifecycle: () => void;
  onRetryLifecycle: () => void;
  onBackToHubs: () => void;
}

export function HubSettings({
  hub,
  canEdit,
  isOwner = false,
  canLockdown,
  saving,
  onSave,
  onDeleteHub,
  onTransferOwnership,
  pendingLifecycleAction,
  lifecycleFailure,
  onLockdownHub,
  onRefreshLifecycle,
  onRetryLifecycle,
  onBackToHubs,
}: HubSettingsProps) {
  const [visibility, setVisibility] = useState<HubVisibilityType>(hub.spec.visibility);
  const [language, setLanguage] = useState(hub.spec.language || "English");
  const [region, setRegion] = useState(hub.spec.region || "Global");

  useEffect(() => {
    setVisibility(hub.spec.visibility);
    setLanguage(hub.spec.language || "English");
    setRegion(hub.spec.region || "Global");
  }, [hub]);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      visibility,
      language: language.trim() || null,
      region: region.trim() || null,
      version: hub.version,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      {/* Directory & Localization */}
      <form onSubmit={handleSaveGeneral} className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <GlobalOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Directory & Localization</h3>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/90">Directory Visibility</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "PUBLIC" as const, title: "Public", desc: "Listed in the explore directory. Any server can request to join." },
              { id: "UNLISTED" as const, title: "Unlisted", desc: "Hidden from search. Servers can only join via invite code." },
              { id: "PRIVATE" as const, title: "Private", desc: "Invite-only. Hub managers must explicitly accept server requests." },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                disabled={!canEdit}
                onClick={() => setVisibility(opt.id)}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  visibility === opt.id
                    ? "bg-violet-500/15 border-violet-400 text-white shadow-sm"
                    : "bg-white/[0.02] border-white/[0.08] text-white/70 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold">{opt.title}</strong>
                  {visibility === opt.id && <span className="w-2 h-2 rounded-full bg-violet-400" />}
                </div>
                <span className="text-[11px] text-white/50 leading-relaxed">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90">Primary Language</label>
            <input
              type="text"
              className="dashboard-input text-xs"
              value={language}
              disabled={!canEdit}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90">Target Region</label>
            <input
              type="text"
              className="dashboard-input text-xs"
              value={region}
              disabled={!canEdit}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="dashboard-btn-primary px-5 py-2 text-xs font-bold"
            >
              <CheckOutlined />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        )}
      </form>

      {onDeleteHub && onTransferOwnership && (
        <HubLifecyclePanel
          hubId={hub.metadata.id}
          hubVersion={hub.version}
          hubName={hub.metadata.name}
          locked={hub.spec.locked}
          isOwner={isOwner}
          canLockdown={canLockdown}
          pendingAction={pendingLifecycleAction}
          failure={lifecycleFailure}
          onLockdown={onLockdownHub}
          onDeleteHub={onDeleteHub}
          onTransferOwnership={onTransferOwnership}
          onRefresh={onRefreshLifecycle}
          onRetry={onRetryLifecycle}
          onBackToHubs={onBackToHubs}
        />
      )}
    </div>
  );
}
