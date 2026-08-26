import { useEffect, useState } from "react";
import {
  SettingOutlined,
  GlobalOutlined,
  WarningOutlined,
  CheckOutlined,
  UserSwitchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput, HubVisibilityType } from "~/schemas/hub";

interface HubSettingsProps {
  hub: HubResource;
  canEdit: boolean;
  isOwner?: boolean;
  saving: boolean;
  onSave: (changes: Partial<PatchHubConfigInput>) => void;
  onDeleteHub?: () => void;
  onTransferOwnership?: (newOwnerId: string) => void;
}

export function HubSettings({
  hub,
  canEdit,
  isOwner = false,
  saving,
  onSave,
  onDeleteHub,
  onTransferOwnership,
}: HubSettingsProps) {
  const [visibility, setVisibility] = useState<HubVisibilityType>(hub.spec.visibility);
  const [language, setLanguage] = useState(hub.spec.language || "English");
  const [region, setRegion] = useState(hub.spec.region || "Global");
  const [transferTarget, setTransferTarget] = useState("");

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

      {/* Ownership Transfer */}
      {isOwner && onTransferOwnership && (
        <div className="rounded-2xl p-6 border flex flex-col gap-4" style={dashboardGlassCardStyle}>
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <UserSwitchOutlined className="text-amber-400 text-base" />
            <h3 className="text-base font-bold text-white font-['Sora'] m-0">Transfer Ownership</h3>
          </div>
          <p className="text-xs text-white/60 m-0">
            Transfer primary ownership of this Hub to another Discord user. This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <input
              type="text"
              placeholder="Target Discord User ID..."
              value={transferTarget}
              onChange={(e) => setTransferTarget(e.target.value)}
              className="dashboard-input text-xs flex-1"
            />
            <button
              type="button"
              disabled={!transferTarget.trim()}
              onClick={() => {
                if (confirm(`Transfer full ownership of "${hub.metadata.name}" to user ${transferTarget}?`)) {
                  onTransferOwnership(transferTarget.trim());
                }
              }}
              className="dashboard-btn-secondary px-4 py-2 text-xs font-bold text-amber-300 border-amber-500/30"
            >
              Transfer Ownership
            </button>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      {canEdit && (
        <div
          className="rounded-2xl p-6 border flex flex-col gap-4"
          style={{
            background: "rgba(239, 68, 68, 0.04)",
            borderColor: "rgba(239, 68, 68, 0.2)",
          }}
        >
          <div className="flex items-center gap-2.5 pb-3 border-b border-red-500/20">
            <WarningOutlined className="text-red-400 text-base" />
            <h3 className="text-base font-bold text-red-300 font-['Sora'] m-0">Danger Zone</h3>
          </div>

          {isOwner && onDeleteHub && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <strong className="text-xs font-bold text-white block">Delete Hub Permanently</strong>
                <small className="text-[11px] text-white/50 block">Destroys all server connections, custom rules, and audit logs.</small>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Permanently delete "${hub.metadata.name}"? This cannot be undone.`)) {
                    onDeleteHub();
                  }
                }}
                className="dashboard-btn-danger px-4 py-1.5 text-xs font-bold flex-shrink-0"
              >
                <DeleteOutlined />
                <span>Delete Hub</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
