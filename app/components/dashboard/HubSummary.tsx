import {
  ClusterOutlined,
  GlobalOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import type { HubResource } from "~/resources/hub";
import { MetricCard } from "./MetricCard";
import { dashboardGlassCardStyle } from "./shared";

interface HubSummaryProps {
  hub: HubResource;
}

export function HubSummary({ hub }: HubSummaryProps) {
  return (
    <div className="flex flex-col gap-6 max-w-5xl w-full">
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
          value={hub.spec.visibility.charAt(0) + hub.spec.visibility.slice(1).toLowerCase()}
          icon={<GlobalOutlined className="text-emerald-300 text-lg" />}
          iconBg="rgba(126, 212, 147, 0.18)"
          contourClass="dashboard-card-contours--sage"
        />
      </div>

      <div
        className="rounded-2xl border overflow-hidden relative flex flex-col justify-end"
        style={dashboardGlassCardStyle}
      >
        <div
          className="w-full h-36 relative overflow-hidden bg-violet-950/40"
          style={{
            backgroundImage: hub.spec.bannerUrl ? `url(${hub.spec.bannerUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!hub.spec.bannerUrl && <div className="dashboard-card-contours pointer-events-none opacity-20" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12111f] via-transparent to-transparent" />
        </div>

        <div className="p-6 pt-0 relative flex items-end gap-4 -mt-10">
          <div className="w-20 h-20 rounded-2xl bg-violet-950/90 border-2 border-white/20 overflow-hidden flex items-center justify-center text-xl font-bold text-violet-200 shadow-xl flex-shrink-0">
            {hub.spec.iconUrl ? (
              <img src={hub.spec.iconUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{hub.metadata.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 pb-1 min-w-0">
            <h2 className="text-xl font-bold text-white font-['Sora'] m-0 truncate">{hub.metadata.name}</h2>
            <span className="text-xs text-white/60">
              {hub.spec.shortDescription || "No tagline added."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
