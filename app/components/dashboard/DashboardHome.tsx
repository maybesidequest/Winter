import { Link } from "react-router";
import {
  PlusOutlined,
  ArrowRightOutlined,
  ClusterOutlined,
  CloudServerOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  SendOutlined,
  PhoneOutlined,
  LinkOutlined,
  SafetyCertificateOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import {
  mockDashboardMetrics,
  mockRecentActivities,
  mockServers,
} from "~/data/dashboard-mock";
import { MetricCard } from "./MetricCard";
import { PageHeader } from "./PageHeader";

export function DashboardHome() {
  const metrics = mockDashboardMetrics;
  const activities = mockRecentActivities;
  const servers = mockServers.slice(0, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "broadcast":
        return <SendOutlined className="text-white text-xs" />;
      case "call":
        return <PhoneOutlined className="text-white text-xs" />;
      case "join":
        return <LinkOutlined className="text-white text-xs" />;
      case "automod":
        return <SafetyCertificateOutlined className="text-white text-xs" />;
      case "call_ended":
        return <DisconnectOutlined className="text-white text-xs" />;
      default:
        return <MessageOutlined className="text-white text-xs" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Overview of your hubs, connected servers, and live network activity."
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/browse"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
            >
              <span>Explore Hubs</span>
              <ArrowRightOutlined className="text-[10px]" />
            </Link>

            <Link
              to="/dashboard/calls"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#5b4ccb] hover:bg-[#6959dc] transition-all flex items-center gap-2"
            >
              <PlusOutlined />
              <span>Start a Call</span>
            </Link>
          </div>
        }
      />

      {/* Row 1: Four Metric Cards inside Creem-style Group Container with Atlas Contours */}
      <div
        className="relative overflow-hidden p-3 md:p-4 rounded-3xl border"
        style={{
          background: "rgba(17, 18, 27, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <MetricCard
            title="Active Hubs"
            value={metrics.activeHubs}
            trend={metrics.activeHubsTrend}
            icon={<ClusterOutlined className="text-[#8175ee]" />}
            iconBg="rgba(91, 76, 203, 0.2)"
            contourClass="dashboard-card-contours--subtle"
          />
          <MetricCard
            title="Connected Servers"
            value={metrics.connectedServers}
            trend={metrics.connectedServersTrend}
            icon={<CloudServerOutlined className="text-[#8fd3ff]" />}
            iconBg="rgba(143, 211, 255, 0.15)"
            contourClass="dashboard-card-contours--sky"
          />
          <MetricCard
            title="Active Calls"
            value={metrics.activeCalls}
            trend={metrics.activeCallsTrend}
            icon={<ThunderboltOutlined className="text-[#ff8c73]" />}
            iconBg="rgba(255, 140, 115, 0.15)"
            contourClass="dashboard-card-contours--coral"
          />
          <MetricCard
            title="Messages Today"
            value={metrics.messagesToday}
            trend={metrics.messagesTodayTrend}
            icon={<MessageOutlined className="text-[#7ed493]" />}
            iconBg="rgba(126, 212, 147, 0.15)"
            contourClass="dashboard-card-contours--sage"
          />
        </div>
      </div>

      {/* Row 2: Two Wider Cards with Atlas Contours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity (7 cols) */}
        <div
          className="relative overflow-hidden lg:col-span-7 p-6 rounded-3xl border flex flex-col justify-between"
          style={{
            background: "rgba(21, 20, 36, 0.85)",
            borderColor: "rgba(255, 255, 255, 0.09)",
          }}
        >
          <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2.5">
                <SendOutlined className="text-sm text-violet-400" />
                <h3 className="text-base font-bold text-white font-['Sora']">Recent Activity</h3>
              </div>
              <span className="text-xs font-semibold text-white/40">Realtime relay</span>
            </div>

            <div className="flex flex-col gap-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border flex items-start gap-3.5 transition-colors duration-150 hover:bg-white/[0.02]"
                  style={{
                    background: "rgba(17, 18, 27, 0.5)",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10"
                    style={{ backgroundColor: act.badgeColor || "#5b4ccb" }}
                  >
                    {getActivityIcon(act.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-xs font-bold text-white truncate">
                        {act.title}
                      </strong>
                      <span className="text-[11px] text-white/40 flex-shrink-0">
                        {act.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-white/40">Filtered by active servers</span>
            <Link
              to="/dashboard/browse"
              className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Explore Hubs →
            </Link>
          </div>
        </div>

        {/* Right: Server Health (5 cols) */}
        <div
          className="relative overflow-hidden lg:col-span-5 p-6 rounded-3xl border flex flex-col justify-between"
          style={{
            background: "rgba(21, 20, 36, 0.85)",
            borderColor: "rgba(255, 255, 255, 0.09)",
          }}
        >
          <div className="dashboard-card-contours--sky pointer-events-none" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2.5">
                <CloudServerOutlined className="text-sm text-[#7ed493]" />
                <h3 className="text-base font-bold text-white font-['Sora']">Server Health</h3>
              </div>
              <span className="text-xs font-semibold text-[#7ed493]">All Systems Operational</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {servers.map((srv) => {
                const isWarning = srv.health === "warning";

                return (
                  <div
                    key={srv.id}
                    className="p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors duration-150 hover:bg-white/[0.02]"
                    style={{
                      background: "rgba(17, 18, 27, 0.5)",
                      borderColor: "rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-['Sora']"
                        style={{ backgroundColor: srv.color }}
                      >
                        {srv.initials}
                      </div>
                      <div className="min-w-0">
                        <strong className="text-xs font-bold text-white truncate block">
                          {srv.name}
                        </strong>
                        <span className="text-[11px] text-white/50 block">
                          {srv.channels} channels · {srv.region}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-mono text-white/50">{srv.latency}</span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isWarning ? "bg-[#ff8c73]" : "bg-[#7ed493]"
                        }`}
                        title={isWarning ? "Elevated latency" : "Healthy"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-white/40">Average latency: 24ms</span>
            <Link
              to="/dashboard/servers/srv-1/overview"
              className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Manage servers →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
