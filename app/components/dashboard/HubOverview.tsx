import { useState, useEffect } from "react";
import { CheckOutlined, PictureOutlined } from "@ant-design/icons";
import { DashboardReadOnlyNotice, dashboardGlassCardStyle, DepthToggle } from "~/components/dashboard/shared";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";

interface HubOverviewProps {
  hub: HubResource;
  canEdit?: boolean;
  saving?: boolean;
  error?: string;
  onSave?: (changes: Partial<PatchHubConfigInput>) => void;
}

export function HubOverview({ hub, canEdit = false, saving = false, error, onSave }: HubOverviewProps) {
  const [name, setName] = useState(hub.metadata.name);
  const [iconUrl, setIconUrl] = useState(hub.spec.iconUrl || "");
  const [bannerUrl, setBannerUrl] = useState(hub.spec.bannerUrl || "");
  const [shortDescription, setShortDescription] = useState(hub.spec.shortDescription || "");
  const [description, setDescription] = useState(hub.spec.description || "");
  const [welcomeMessage, setWelcomeMessage] = useState(hub.spec.welcomeMessage || "");
  const [visibility, setVisibility] = useState(hub.spec.visibility);
  const [language, setLanguage] = useState(hub.spec.language || "");
  const [region, setRegion] = useState(hub.spec.region || "");
  const [nsfw, setNsfw] = useState(hub.spec.nsfw);
  const [appealCooldownHours, setAppealCooldownHours] = useState(hub.spec.appealCooldownHours ?? 168);

  useEffect(() => {
    setName(hub.metadata.name);
    setIconUrl(hub.spec.iconUrl || "");
    setBannerUrl(hub.spec.bannerUrl || "");
    setShortDescription(hub.spec.shortDescription || "");
    setDescription(hub.spec.description || "");
    setWelcomeMessage(hub.spec.welcomeMessage || "");
    setVisibility(hub.spec.visibility);
    setLanguage(hub.spec.language || "");
    setRegion(hub.spec.region || "");
    setNsfw(hub.spec.nsfw);
    setAppealCooldownHours(hub.spec.appealCooldownHours ?? 168);
  }, [hub]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        name: name.trim(),
        iconUrl: iconUrl.trim() || null,
        bannerUrl: bannerUrl.trim() || null,
        shortDescription: shortDescription.trim() || null,
        description: description.trim() || null,
        welcomeMessage: welcomeMessage.trim() || null,
        visibility,
        language: language.trim() || null,
        region: region.trim() || null,
        nsfw,
        appealCooldownHours: Number(appealCooldownHours),
        version: hub.version,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl w-full">
      {!canEdit && <DashboardReadOnlyNotice />}
      {/* Profile & Branding Editor */}
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        {error && (
          <div role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
            {error}
          </div>
        )}
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <PictureOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Hub Identity & Branding</h3>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-name">Hub name</label>
            <span className="text-[11px] text-white/40">{name.length}/100</span>
          </div>
          <input
            id="hub-name"
            type="text"
            className="dashboard-input text-xs"
            maxLength={100}
            required
            value={name}
            disabled={!canEdit}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90">Icon Image URL</label>
            <input
              type="url"
              className="dashboard-input text-xs"
              placeholder="https://example.com/icon.png"
              value={iconUrl}
              disabled={!canEdit}
              onChange={(e) => setIconUrl(e.target.value)}
            />
            <span className="text-[11px] text-white/40">Square avatar for directory listings & member badges.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90">Banner Image URL</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-language">Primary language</label>
            <input
              id="hub-language"
              type="text"
              className="dashboard-input text-xs"
              value={language}
              maxLength={32}
              disabled={!canEdit}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-region">Primary region</label>
            <input
              id="hub-region"
              type="text"
              className="dashboard-input text-xs"
              value={region}
              maxLength={32}
              disabled={!canEdit}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 text-xs font-bold text-white/90">
            <DepthToggle checked={nsfw} disabled={!canEdit} onChange={setNsfw} aria-label="Age-restricted Hub" />
            Age-restricted Hub (18+)
          </label>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-appeal-cooldown">Appeal cooldown</label>
            <input
              id="hub-appeal-cooldown"
              type="number"
              min={0}
              max={8760}
              className="dashboard-input text-xs w-28"
              value={appealCooldownHours}
              disabled={!canEdit}
              onChange={(e) => setAppealCooldownHours(Number(e.target.value))}
            />
            <span className="text-xs text-white/50">hours</span>
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
            placeholder="A punchy 1-sentence summary of your Hub..."
            maxLength={100}
            value={shortDescription}
            disabled={!canEdit}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-visibility">Visibility</label>
            <select
              id="hub-visibility"
              className="dashboard-input text-xs"
              value={visibility}
              disabled={!canEdit}
              onChange={(e) => setVisibility(e.target.value as HubResource["spec"]["visibility"])}
            >
              <option value="PUBLIC">Public</option>
              <option value="UNLISTED">Unlisted</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-welcome">Welcome message</label>
            <input
              id="hub-welcome"
              type="text"
              className="dashboard-input text-xs"
              maxLength={2000}
              value={welcomeMessage}
              disabled={!canEdit}
              onChange={(e) => setWelcomeMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90">Detailed Bio / Description</label>
            <span className="text-[11px] text-white/40">{description.length}/1024</span>
          </div>
          <textarea
            className="dashboard-textarea min-h-[100px]"
            placeholder="Explain what your Hub is about, topic interests, and guidelines..."
            maxLength={1024}
            value={description}
            disabled={!canEdit}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {canEdit && onSave && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="dashboard-btn-primary px-6 py-2.5 text-xs font-bold shadow-md"
            >
              <CheckOutlined />
              <span>{saving ? "Saving Branding..." : "Save Identity Changes"}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
