import type { ReactNode } from "react";
import { useParams, Link } from "react-router";
import {
  ClusterOutlined,
  LineChartOutlined,
  TeamOutlined,
  FileProtectOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { mockHubs } from "~/data/dashboard-mock";
import { PageHeader } from "~/components/dashboard/PageHeader";

export default function HubWorkspace() {
  const params = useParams();
  const hubId = params.hubId;
  const view = params.view || params.tab || "overview";

  const hub = mockHubs.find((h) => h.id === hubId) || {
    id: hubId || "hub-1",
    name: "Hub Workspace",
    tag: "HUB",
    initials: "HW",
    iconType: "global" as const,
    color: "#5b4ccb",
    memberCount: 2500,
    serverCount: 12,
    description: "Multi-server channel bridge and moderation zone.",
    category: "Community",
    locked: false,
    visibility: "PUBLIC" as const,
  };

  const viewTitles: Record<string, { title: string; desc: string; icon: ReactNode }> = {
    overview: {
      title: "Hub Overview",
      desc: "Live broadcast status, active member count, and linked server health.",
      icon: <ClusterOutlined />,
    },
    analytics: {
      title: "Hub Analytics",
      desc: "Message velocity, cross-server engagement, and peak interaction hours.",
      icon: <LineChartOutlined />,
    },
    members: {
      title: "Hub Members & Roles",
      desc: "Server representatives, moderators, and cross-server permissions.",
      icon: <TeamOutlined />,
    },
    rules: {
      title: "Hub Rules & Policies",
      desc: "Automated content moderation rules, keyword filters, and broadcast limits.",
      icon: <FileProtectOutlined />,
    },
    settings: {
      title: "Hub Settings",
      desc: "Hub name, icon, invite codes, public directory listing, and archive state.",
      icon: <SettingOutlined />,
    },
  };

  const currentView = viewTitles[view] || {
    title: `${view[0].toUpperCase()}${view.slice(1)}`,
    desc: `Manage ${view} for ${hub.name}.`,
    icon: <ClusterOutlined />,
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Hub Control Plane"
        title={`${hub.name} · ${currentView.title}`}
        description={hub.description}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Dashboard
            </Link>
          </div>
        }
      />

      <div
        className="relative overflow-hidden p-8 md:p-12 rounded-3xl border flex flex-col items-center justify-center text-center gap-4"
        style={{
          background: "rgba(21, 20, 36, 0.85)",
          borderColor: "rgba(255, 255, 255, 0.09)",
          boxShadow: "0 4px 0 0 rgba(0, 0, 0, 0.45)",
        }}
      >
        <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1 border border-white/10 text-white"
            style={{ backgroundColor: hub.color }}
          >
            {currentView.icon}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5b4ccb]/20 text-violet-300 border border-[#5b4ccb]/40">
              {hub.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/60">
              {hub.serverCount} Servers
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white font-['Sora']">{currentView.title}</h3>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            {currentView.desc}
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
            Tab view configured according to Discord <code className="text-violet-400">/hub manage</code> specifications.
          </div>
        </div>
      </div>
    </div>
  );
}
