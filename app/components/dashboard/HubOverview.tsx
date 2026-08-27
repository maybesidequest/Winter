import {
  CheckOutlined,
  ClusterOutlined,
  GlobalOutlined,
  MessageOutlined,
  PictureOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { dashboardGlassCardStyle, DashboardReadOnlyNotice, DepthToggle } from "~/components/dashboard/shared";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";
import { MetricCard } from "./MetricCard";

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

  const prevHubIdRef = useRef(hub.metadata.id);

  const isDirty = useMemo(() => {
    return (
      name !== hub.metadata.name ||
      iconUrl !== (hub.spec.iconUrl || "") ||
      bannerUrl !== (hub.spec.bannerUrl || "") ||
      shortDescription !== (hub.spec.shortDescription || "") ||
      description !== (hub.spec.description || "") ||
      welcomeMessage !== (hub.spec.welcomeMessage || "") ||
      visibility !== hub.spec.visibility ||
      language !== (hub.spec.language || "") ||
      region !== (hub.spec.region || "") ||
      nsfw !== hub.spec.nsfw ||
      appealCooldownHours !== (hub.spec.appealCooldownHours ?? 168)
    );
  }, [name, iconUrl, bannerUrl, shortDescription, description, welcomeMessage, visibility, language, region, nsfw, appealCooldownHours, hub]);

  const handleReset = () => {
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
  };

  useEffect(() => {
    // Only overwrite local form state if switching to a different hub or if form is clean
    if (prevHubIdRef.current !== hub.metadata.id || !isDirty) {
      handleReset();
      prevHubIdRef.current = hub.metadata.id;
    }
  }, [hub]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSave && canEdit) {
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
      {/* Top Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Connections"
          value={hub.status.connectionCount}
          icon={<ClusterOutlined className="text-violet-300 text-lg" />}
          iconBg="rgba(129, 117, 238, 0.18)"
        />
        <MetricCard
          title="Weekly Messages"
          value={hub.status.weeklyMessageCount}
          icon={<MessageOutlined className="text-sky-300 text-lg" />}
          iconBg="rgba(143, 211, 255, 0.18)"
          contourClass="dashboard-card-contours--sky"
        />
        <MetricCard
          title="Visibility"
          value={visibility.charAt(0) + visibility.slice(1).toLowerCase()}
          icon={<GlobalOutlined className="text-emerald-300 text-lg" />}
          iconBg="rgba(126, 212, 147, 0.18)"
          contourClass="dashboard-card-contours--sage"
        />
      </div>

      {/* Hub Hero Banner Card */}
      <div
        className="rounded-2xl border overflow-hidden relative flex flex-col justify-end"
        style={dashboardGlassCardStyle}
      >
        <div
          className="w-full h-36 relative overflow-hidden bg-violet-950/40"
          style={{
            backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!bannerUrl && <div className="dashboard-card-contours pointer-events-none opacity-20" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12111f] via-transparent to-transparent" />
        </div>

        <div className="p-6 pt-0 relative flex items-end gap-4 -mt-10">
          <div className="w-20 h-20 rounded-2xl bg-violet-950/90 border-2 border-white/20 overflow-hidden flex items-center justify-center text-xl font-bold text-violet-200 shadow-xl flex-shrink-0">
            {iconUrl ? (
              <img src={iconUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{(name || hub.metadata.name).slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 pb-1 min-w-0">
            <h2 className="text-xl font-bold text-white font-['Sora'] m-0 truncate">{name || hub.metadata.name}</h2>
            <span className="text-xs text-white/60">
              {shortDescription || "No tagline added."}
            </span>
          </div>
        </div>
      </div>

      {/* Read-only notice if user lacks edit permissions */}
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
            <span className="text-[11px] text-white/60 font-medium">{name.length}/100</span>
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
            <span className="text-[11px] text-white/60">Square avatar for directory listings & member badges.</span>
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
            <span className="text-[11px] text-white/60">Wide background banner for explore pages.</span>
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
            <span className="text-xs text-white/60">hours</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90">Short Tagline</label>
            <span className="text-[11px] text-white/60 font-medium">{shortDescription.length}/100</span>
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
            <span className="text-[11px] text-white/60 font-medium">{description.length}/1024</span>
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
            {isDirty && (
              <button
                type="button"
                disabled={saving}
                onClick={handleReset}
                className="dashboard-btn-secondary px-4 py-2.5 text-xs font-bold cursor-pointer"
              >
                <UndoOutlined />
                <span>Reset</span>
              </button>
            )}
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="dashboard-btn-primary px-6 py-2.5 text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckOutlined />
              <span>{saving ? "Saving Branding..." : isDirty ? "Save Identity Changes" : "Branding Saved"}</span>
            </button>
          </div>
        )}
      </form>

      {/* Floating Unsaved Changes Warning Bar */}
      {canEdit && isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-6 px-5 py-3 rounded-2xl bg-[#161424]/95 border border-violet-500/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-xs animate-fadeIn w-[90%] max-w-2xl">
          <div className="flex items-center gap-2.5 text-white/90">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold">Careful — you have unsaved changes!</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={handleReset}
              className="dashboard-btn-secondary px-3.5 py-1.5 text-xs font-bold cursor-pointer"
            >
              <UndoOutlined />
              <span>Reset</span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit()}
              className="dashboard-btn-primary px-4 py-1.5 text-xs font-bold cursor-pointer"
            >
              <CheckOutlined />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
