import { useEffect, useState } from "react";
import {
  SafetyCertificateOutlined,
  BellOutlined,
  LockOutlined,
  WarningOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { DepthToggle, dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";

interface HubSafetyViewProps {
  hub: HubResource;
  canEdit: boolean;
  saving: boolean;
  onSave: (changes: Partial<PatchHubConfigInput>) => void;
}

export function HubSafetyView({ hub, canEdit, saving, onSave }: HubSafetyViewProps) {
  const [locked, setLocked] = useState(hub.spec.locked);
  const [nsfw, setNsfw] = useState(hub.spec.nsfw);
  const [appealCooldownHours, setAppealCooldownHours] = useState(hub.spec.appealCooldownHours ?? 168);
  const [welcomeMessage, setWelcomeMessage] = useState(hub.spec.welcomeMessage || "");

  useEffect(() => {
    setLocked(hub.spec.locked);
    setNsfw(hub.spec.nsfw);
    setAppealCooldownHours(hub.spec.appealCooldownHours ?? 168);
    setWelcomeMessage(hub.spec.welcomeMessage || "");
  }, [hub]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      locked,
      nsfw,
      appealCooldownHours: Number(appealCooldownHours) || 0,
      welcomeMessage: welcomeMessage.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-4xl">
      {!canEdit && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm flex items-center gap-3">
          <InfoCircleOutlined className="text-amber-400 text-base flex-shrink-0" />
          <span>Your current Hub permissions allow viewing these safety settings, but not modifying them.</span>
        </div>
      )}

      {/* Safety & Moderation Controls Card */}
      <div className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <SafetyCertificateOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Safety & Incident Controls</h3>
        </div>

        <div className="dashboard-toggle-row">
          <div>
            <strong className="text-xs font-bold text-white flex items-center gap-2">
              <LockOutlined className="text-violet-400" />
              Lock Network Activity
            </strong>
            <small className="text-[11px] text-white/50">
              Immediately pause all outgoing & incoming broadcast messages across all connected Discord servers.
            </small>
          </div>
          <DepthToggle checked={locked} disabled={!canEdit} onChange={setLocked} aria-label="Lock network activity" />
        </div>

        <div className="dashboard-toggle-row">
          <div>
            <strong className="text-xs font-bold text-white flex items-center gap-2">
              <WarningOutlined className="text-amber-400" />
              Age-Restricted (NSFW) Space
            </strong>
            <small className="text-[11px] text-white/50">
              Flags the Hub as containing adult content. Connected servers will only bridge into age-restricted Discord channels.
            </small>
          </div>
          <DepthToggle checked={nsfw} disabled={!canEdit} onChange={setNsfw} aria-label="Age-restricted NSFW" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <strong className="text-xs font-bold text-white block">Sanction Appeal Cooldown</strong>
            <small className="text-[11px] text-white/50 block">
              Waiting time required before sanctioned users can submit a new appeal ticket.
            </small>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={8760}
              className="dashboard-input w-24 text-xs font-bold text-center"
              value={appealCooldownHours}
              disabled={!canEdit}
              onChange={(e) => setAppealCooldownHours(Number(e.target.value))}
            />
            <span className="text-xs text-white/60 font-medium">
              hours ({Math.round(appealCooldownHours / 24)} days)
            </span>
          </div>
        </div>
      </div>

      {/* Welcome Broadcast & Greeting Message */}
      <div className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <MessageOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Join Announcement Broadcast</h3>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90">Welcome Message</label>
            <span className="text-[11px] text-white/40">{welcomeMessage.length}/2000</span>
          </div>
          <textarea
            className="dashboard-textarea min-h-[110px]"
            placeholder="Sent across all connected servers when a new Discord community links to this Hub..."
            maxLength={2000}
            value={welcomeMessage}
            disabled={!canEdit}
            onChange={(e) => setWelcomeMessage(e.target.value)}
          />
          <span className="text-[11px] text-white/40">Markdown headers, lists, and links are formatted automatically.</span>
        </div>
      </div>

      {/* Audit & Log Streams Summary Card */}
      <div className="rounded-2xl p-6 border flex flex-col gap-4" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <BellOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Audit & Log Streams</h3>
        </div>
        <p className="text-xs text-white/60 m-0">
          Audit events, Polarizer automod strikes, and sanction appeals are delivered in real-time to your configured Discord logging channels.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-white">Safety Threat Alerts</span>
              <span className="text-[11px] text-white/40">Polarizer NSFW & attack signals</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Active
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-white">Appeals Stream</span>
              <span className="text-[11px] text-white/40">User sanction submissions</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Save Button Footer */}
      {canEdit && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="dashboard-btn-primary px-6 py-2.5 text-xs font-bold shadow-md"
          >
            <CheckOutlined />
            <span>{saving ? "Saving Safety Settings..." : "Save Safety Configuration"}</span>
          </button>
        </div>
      )}
    </form>
  );
}

