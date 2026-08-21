import { useEffect, useState } from "react";
import {
  PictureOutlined,
  SafetyCertificateOutlined,
  MessageOutlined,
  CheckOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { DepthToggle, dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";

export function HubSettings({
  hub,
  canEdit,
  saving,
  onSave,
}: {
  hub: HubResource;
  canEdit: boolean;
  saving: boolean;
  onSave: (changes: Partial<PatchHubConfigInput>) => void;
}) {
  const [iconUrl, setIconUrl] = useState(hub.spec.iconUrl || "");
  const [bannerUrl, setBannerUrl] = useState(hub.spec.bannerUrl || "");
  const [shortDescription, setShortDescription] = useState(hub.spec.shortDescription || "");
  const [description, setDescription] = useState(hub.spec.description || "");
  const [welcomeMessage, setWelcomeMessage] = useState(hub.spec.welcomeMessage || "");
  const [locked, setLocked] = useState(hub.spec.locked);
  const [nsfw, setNsfw] = useState(hub.spec.nsfw);
  const [appealCooldownHours, setAppealCooldownHours] = useState(hub.spec.appealCooldownHours ?? 168);

  useEffect(() => {
    setIconUrl(hub.spec.iconUrl || "");
    setBannerUrl(hub.spec.bannerUrl || "");
    setShortDescription(hub.spec.shortDescription || "");
    setDescription(hub.spec.description || "");
    setWelcomeMessage(hub.spec.welcomeMessage || "");
    setLocked(hub.spec.locked);
    setNsfw(hub.spec.nsfw);
    setAppealCooldownHours(hub.spec.appealCooldownHours ?? 168);
  }, [hub]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      iconUrl: iconUrl.trim() || null,
      bannerUrl: bannerUrl.trim() || null,
      shortDescription: shortDescription.trim() || null,
      description: description.trim() || null,
      welcomeMessage: welcomeMessage.trim() || null,
      locked,
      nsfw,
      appealCooldownHours: Number(appealCooldownHours) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-4xl">
      {!canEdit && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm flex items-center gap-3">
          <InfoCircleOutlined className="text-amber-400 text-base flex-shrink-0" />
          <span>Your current Hub capabilities allow viewing these settings, but not modifying them.</span>
        </div>
      )}

      {/* Profile & Branding Section */}
      <div className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <PictureOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Branding & Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90">Icon URL</label>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-violet-950/60 border border-violet-400/20 flex items-center justify-center text-xs font-bold text-violet-300 flex-shrink-0">
                {iconUrl ? (
                  <img src={iconUrl} alt="Icon preview" className="w-full h-full object-cover" />
                ) : (
                  <span>{hub.metadata.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <input
                type="url"
                className="dashboard-input text-xs"
                placeholder="https://example.com/icon.png"
                value={iconUrl}
                disabled={!canEdit}
                onChange={(e) => setIconUrl(e.target.value)}
              />
            </div>
            <span className="text-[11px] text-white/40">Square image for directory cards & avatar lists.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90">Banner URL</label>
            <input
              type="url"
              className="dashboard-input text-xs"
              placeholder="https://example.com/banner.png"
              value={bannerUrl}
              disabled={!canEdit}
              onChange={(e) => setBannerUrl(e.target.value)}
            />
            <span className="text-[11px] text-white/40">Wide background banner for explore pages.</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90">Short Tagline</label>
            <span className="text-[11px] text-white/40">{shortDescription.length}/100</span>
          </div>
          <input
            type="text"
            className="dashboard-input text-xs"
            placeholder="A short punchy summary for listings..."
            maxLength={100}
            value={shortDescription}
            disabled={!canEdit}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90">Full Description</label>
            <span className="text-[11px] text-white/40">{description.length}/1024</span>
          </div>
          <textarea
            className="dashboard-textarea min-h-[90px]"
            placeholder="Provide a detailed explanation of your Hub's purpose, topic, and community guidelines..."
            maxLength={1024}
            value={description}
            disabled={!canEdit}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Community & Welcome Message Section */}
      <div className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <MessageOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Welcome Broadcast</h3>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90">Join Announcement Message</label>
            <span className="text-[11px] text-white/40">{welcomeMessage.length}/2000</span>
          </div>
          <textarea
            className="dashboard-textarea min-h-[110px]"
            placeholder="Broadcasted automatically across all connected servers whenever a new community links to this Hub..."
            maxLength={2000}
            value={welcomeMessage}
            disabled={!canEdit}
            onChange={(e) => setWelcomeMessage(e.target.value)}
          />
          <span className="text-[11px] text-white/40">Markdown formatting is fully supported.</span>
        </div>
      </div>

      {/* Safety & Moderation Controls */}
      <div className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <SafetyCertificateOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Safety & Moderation</h3>
        </div>

        <div className="dashboard-toggle-row">
          <div>
            <strong className="text-xs font-bold text-white">Lock Network Activity</strong>
            <small className="text-[11px] text-white/50">Temporarily pause new cross-server messages while staff handles incidents.</small>
          </div>
          <DepthToggle checked={locked} disabled={!canEdit} onChange={setLocked} aria-label="Lock network activity" />
        </div>

        <div className="dashboard-toggle-row">
          <div>
            <strong className="text-xs font-bold text-white">Age-Restricted (NSFW)</strong>
            <small className="text-[11px] text-white/50">Mark this Hub as intended strictly for 18+ adult communities.</small>
          </div>
          <DepthToggle checked={nsfw} disabled={!canEdit} onChange={setNsfw} aria-label="Age-restricted NSFW" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <strong className="text-xs font-bold text-white block">Appeal Cooldown Period</strong>
            <small className="text-[11px] text-white/50 block">Waiting time required before banned users can submit a new sanction appeal.</small>
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
            <span className="text-xs text-white/60 font-medium">hours ({Math.round(appealCooldownHours / 24)} days)</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {canEdit && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="dashboard-btn-primary px-6 py-2.5 text-xs font-bold shadow-md"
          >
            <CheckOutlined />
            <span>{saving ? "Saving Changes..." : "Save Hub Configuration"}</span>
          </button>
        </div>
      )}
    </form>
  );
}
