import { useState, useEffect } from "react";
import {
  ClusterOutlined,
  MessageOutlined,
  GlobalOutlined,
  PictureOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { MetricCard } from "~/components/dashboard/MetricCard";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";

interface HubOverviewProps {
  hub: HubResource;
  canEdit?: boolean;
  saving?: boolean;
  onSave?: (changes: Partial<PatchHubConfigInput>) => void;
}

export function HubOverview({ hub, canEdit = false, saving = false, onSave }: HubOverviewProps) {
  const [iconUrl, setIconUrl] = useState(hub.spec.iconUrl || "");
  const [bannerUrl, setBannerUrl] = useState(hub.spec.bannerUrl || "");
  const [shortDescription, setShortDescription] = useState(hub.spec.shortDescription || "");
  const [description, setDescription] = useState(hub.spec.description || "");

  useEffect(() => {
    setIconUrl(hub.spec.iconUrl || "");
    setBannerUrl(hub.spec.bannerUrl || "");
    setShortDescription(hub.spec.shortDescription || "");
    setDescription(hub.spec.description || "");
  }, [hub]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        iconUrl: iconUrl.trim() || null,
        bannerUrl: bannerUrl.trim() || null,
        shortDescription: shortDescription.trim() || null,
        description: description.trim() || null,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl w-full">
      {/* Network Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Connected Bridges"
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
          title="Directory Visibility"
          value={hub.spec.visibility.charAt(0) + hub.spec.visibility.slice(1).toLowerCase()}
          icon={<GlobalOutlined className="text-emerald-300 text-lg" />}
          iconBg="rgba(126, 212, 147, 0.18)"
          contourClass="dashboard-card-contours--sage"
        />
      </div>

      {/* Hero Visual Presentation Card */}
      <div className="rounded-2xl border overflow-hidden relative flex flex-col justify-end" style={dashboardGlassCardStyle}>
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

        <div className="p-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-violet-950/90 border-2 border-white/20 overflow-hidden flex items-center justify-center text-xl font-bold text-violet-200 shadow-xl flex-shrink-0">
              {iconUrl ? (
                <img src={iconUrl} alt={hub.metadata.name} className="w-full h-full object-cover" />
              ) : (
                <span>{hub.metadata.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col gap-1 pb-1">
              <h2 className="text-xl font-bold text-white font-['Sora'] m-0">{hub.metadata.name}</h2>
              <span className="text-xs text-white/60">{shortDescription || "No short tagline set."}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Branding Editor */}
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 border flex flex-col gap-5" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <PictureOutlined className="text-violet-400 text-base" />
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">Hub Identity & Branding</h3>
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
