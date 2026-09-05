import { CheckOutlined, PictureOutlined, UndoOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBlocker } from "react-router";
import { dashboardGlassCardStyle, DashboardReadOnlyNotice, DepthToggle } from "~/components/dashboard/shared";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";
import { HubUnsavedChangesModal } from "./HubUnsavedChangesModal";

interface HubBrandingPanelProps {
  hub: HubResource;
  canEdit?: boolean;
  saving?: boolean;
  error?: string;
  onSave?: (changes: Partial<PatchHubConfigInput>) => void;
}

export function HubBrandingPanel({ hub, canEdit = false, saving = false, error, onSave }: HubBrandingPanelProps) {
  const [name, setName] = useState(hub.metadata.name);
  const [iconUrl, setIconUrl] = useState(hub.spec.iconUrl || "");
  const [bannerUrl, setBannerUrl] = useState(hub.spec.bannerUrl || "");
  const [shortDescription, setShortDescription] = useState(hub.spec.shortDescription || "");
  const [description, setDescription] = useState(hub.spec.description || "");
  const [welcomeMessage, setWelcomeMessage] = useState(hub.spec.welcomeMessage || "");
  const [nsfw, setNsfw] = useState(hub.spec.nsfw);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const prevHubIdRef = useRef(hub.metadata.id);

  const isDirty = useMemo(() => {
    return (
      name !== hub.metadata.name ||
      iconUrl !== (hub.spec.iconUrl || "") ||
      bannerUrl !== (hub.spec.bannerUrl || "") ||
      shortDescription !== (hub.spec.shortDescription || "") ||
      description !== (hub.spec.description || "") ||
      welcomeMessage !== (hub.spec.welcomeMessage || "") ||
      nsfw !== hub.spec.nsfw
    );
  }, [name, iconUrl, bannerUrl, shortDescription, description, welcomeMessage, nsfw, hub]);

  const blocker = useBlocker(Boolean(isDirty && canEdit));

  useEffect(() => {
    if (!isDirty || !canEdit) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, canEdit]);

  const handleReset = () => {
    setName(hub.metadata.name);
    setIconUrl(hub.spec.iconUrl || "");
    setBannerUrl(hub.spec.bannerUrl || "");
    setShortDescription(hub.spec.shortDescription || "");
    setDescription(hub.spec.description || "");
    setWelcomeMessage(hub.spec.welcomeMessage || "");
    setNsfw(hub.spec.nsfw);
  };

  useEffect(() => {
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
        nsfw,
        version: hub.version,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      {/* Live Hero Banner Preview Card */}
      <div className="rounded-2xl border overflow-hidden relative flex flex-col justify-end" style={dashboardGlassCardStyle}>
        <div
          className="w-full h-36 relative overflow-hidden bg-violet-950/40"
          style={{
            backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!bannerUrl && <div className="dashboard-card-contours pointer-events-none opacity-20" aria-hidden="true" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#13141f] via-transparent to-transparent" />
        </div>
        <div className="p-6 pt-0 relative flex items-end gap-4 -mt-10">
          <div className="w-20 h-20 rounded-2xl bg-violet-950/90 border-2 border-white/20 overflow-hidden flex items-center justify-center text-xl font-bold text-violet-200 shadow-xl flex-shrink-0">
            {iconUrl ? <img src={iconUrl} alt="" className="w-full h-full object-cover" /> : <span>{(name || hub.metadata.name).slice(0, 2).toUpperCase()}</span>}
          </div>
          <div className="flex flex-col gap-1 pb-1 min-w-0">
            <h2 className="text-xl font-bold text-white font-['Sora'] m-0 truncate">{name || hub.metadata.name}</h2>
            <span className="text-xs text-white/60">{shortDescription || "No tagline added."}</span>
          </div>
        </div>
      </div>

      {!canEdit && <DashboardReadOnlyNotice />}

      {/* Identity Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        {error && (
          <div role="alert" className="rounded-xl border border-[#ff8c73]/30 bg-[#ff8c73]/10 px-3 py-2 text-xs text-[#ff8c73]">
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
            <span id="hub-name-count" className="text-xs text-white/60 font-medium">{name.length}/100</span>
          </div>
          <input
            id="hub-name"
            type="text"
            className="dashboard-input text-sm"
            maxLength={100}
            required
            value={name}
            disabled={!canEdit}
            aria-describedby="hub-name-count"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-icon-url">Icon image URL</label>
            <input
              id="hub-icon-url"
              type="url"
              className="dashboard-input text-sm"
              placeholder="https://example.com/icon.png"
              value={iconUrl}
              disabled={!canEdit}
              aria-describedby="hub-icon-desc"
              onChange={(e) => setIconUrl(e.target.value)}
            />
            <span id="hub-icon-desc" className="text-xs text-white/60">Square avatar for directory listings & member badges.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-banner-url">Banner image URL</label>
            <input
              id="hub-banner-url"
              type="url"
              className="dashboard-input text-sm"
              placeholder="https://example.com/banner.png"
              value={bannerUrl}
              disabled={!canEdit}
              aria-describedby="hub-banner-desc"
              onChange={(e) => setBannerUrl(e.target.value)}
            />
            <span id="hub-banner-desc" className="text-xs text-white/60">Wide background banner for explore pages.</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-tagline">Short tagline</label>
            <span id="hub-tagline-count" className="text-xs text-white/60 font-medium">{shortDescription.length}/100</span>
          </div>
          <input
            id="hub-tagline"
            type="text"
            className="dashboard-input text-sm"
            placeholder="A punchy 1-sentence summary of your Hub..."
            maxLength={100}
            value={shortDescription}
            disabled={!canEdit}
            aria-describedby="hub-tagline-count"
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/90" htmlFor="hub-welcome">Welcome message</label>
          <input
            id="hub-welcome"
            type="text"
            className="dashboard-input text-sm"
            maxLength={2000}
            placeholder="Greeting shown to new members joining through linked servers..."
            value={welcomeMessage}
            disabled={!canEdit}
            aria-describedby="hub-welcome-desc"
            onChange={(e) => setWelcomeMessage(e.target.value)}
          />
          <span id="hub-welcome-desc" className="text-xs text-white/60">Delivered when users transition through cross-server bridges.</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-bio">Detailed bio & description</label>
            <span id="hub-bio-count" className="text-xs text-white/60 font-medium">{description.length}/1024</span>
          </div>
          <textarea
            id="hub-bio"
            className="dashboard-textarea min-h-[100px] text-sm"
            placeholder="Explain what your Hub is about, topic interests, and guidelines..."
            maxLength={1024}
            value={description}
            disabled={!canEdit}
            aria-describedby="hub-bio-count"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-1">
          <label className="flex items-center gap-3 text-xs font-bold text-white/90 cursor-pointer w-fit">
            <DepthToggle checked={nsfw} disabled={!canEdit} onChange={setNsfw} aria-label="Age-restricted Hub" />
            <span>Age-restricted Hub (18+)</span>
          </label>
        </div>
      </form>

      {/* Floating Unsaved Changes Dock */}
      {canEdit && isDirty && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-6 px-5 py-3 rounded-2xl border border-violet-500/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-xs animate-fadeIn w-[90%] max-w-2xl"
          style={{ background: "#181726" }}
        >
          <div className="flex items-center gap-2.5 text-white/90">
            <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
            <span className="font-semibold">Unsaved branding changes</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => setShowResetConfirm(true)}
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

      {/* Reset Confirmation Modal */}
      <HubUnsavedChangesModal
        open={showResetConfirm}
        title="Reset Branding Changes?"
        description="All uncommitted edits to your Hub identity, tagline, and media will be reverted to currently saved settings."
        confirmLabel="Reset All"
        cancelLabel="Keep Editing"
        onConfirm={() => {
          handleReset();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Navigation Interception Modal */}
      <HubUnsavedChangesModal
        open={blocker.state === "blocked"}
        title="Unsaved Changes"
        description="You have unsaved changes to your Hub identity. Leaving this page will discard all uncommitted edits."
        confirmLabel="Discard & Leave"
        cancelLabel="Stay on Page"
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </div>
  );
}

