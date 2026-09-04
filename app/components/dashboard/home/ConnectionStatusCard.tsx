import {
  ApiOutlined,
  ArrowRightOutlined,
  CloudServerOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { HubResource } from "~/resources/hub";
import type { ServerResource } from "~/resources/server";

interface ConnectionStatusCardProps {
  hubs: HubResource[];
  servers: ServerResource[];
}

export function ConnectionStatusCard({ hubs, servers }: ConnectionStatusCardProps) {
  const totalHubs = hubs.length;
  const totalServers = servers.length;

  const totalConnections = hubs.reduce(
    (sum, hub) => sum + (hub.status?.connectionCount || 0),
    0
  );

  const isConnected = totalConnections > 0;
  const hasSetup = totalHubs > 0 || totalServers > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Primary Channel Bridge Status (2 columns on large screens) */}
      <div
        className="lg:col-span-2 rounded-2xl p-6 border flex flex-col justify-between gap-6"
        style={dashboardGlassCardStyle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-xl text-violet-300">
              <ApiOutlined />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70 m-0">
                Connection Status
              </p>
              <h2 className="text-xl font-bold text-white font-['Sora'] mt-0.5 m-0">
                Connected Channels
              </h2>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
              isConnected
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : hasSetup
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "bg-white/5 text-white/60 border-white/10"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? "bg-emerald-400 animate-pulse"
                  : hasSetup
                    ? "bg-amber-400"
                    : "bg-white/40"
              }`}
            />
            <span>
              {isConnected
                ? "All channels linked"
                : hasSetup
                  ? "Ready to link"
                  : "Not set up yet"}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-['Sora']">
              {totalConnections}
            </span>
            <span className="text-sm font-semibold text-white/60">
              {totalConnections === 1 ? "channel active" : "channels active"}
            </span>
          </div>
          <p className="text-xs text-white/60 mt-2 m-0 max-w-lg">
            {isConnected
              ? "Messages sent in these Discord channels automatically relay across your connected Hubs."
              : "No Discord channels are linked yet. Link a text channel in your server to start cross-server chat."}
          </p>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-white/60">
            Across {totalHubs} {totalHubs === 1 ? "Hub" : "Hubs"} and {totalServers}{" "}
            {totalServers === 1 ? "Server" : "Servers"}
          </span>
          <Link
            to="/dashboard/servers"
            className="text-xs font-bold text-violet-300 hover:text-violet-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Manage channels</span>
            <ArrowRightOutlined className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Hubs & Servers Summary Cards (1 column, stacked) */}
      <div className="flex flex-col gap-4">
        {/* Hubs Card */}
        <Link
          to="/dashboard/hubs"
          className="rounded-2xl p-5 border transition-all hover:border-violet-400/40 group flex flex-col justify-between"
          style={dashboardGlassCardStyle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ClusterOutlined className="text-lg text-violet-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                Your Hubs
              </span>
            </div>
            <ArrowRightOutlined className="text-xs text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-white font-['Sora'] m-0">{totalHubs}</p>
            <p className="text-xs text-white/60 mt-1 m-0">
              {totalHubs === 1 ? "Hub network you manage" : "Hub networks you manage"}
            </p>
          </div>
        </Link>

        {/* Servers Card */}
        <Link
          to="/dashboard/servers"
          className="rounded-2xl p-5 border transition-all hover:border-sky-400/40 group flex flex-col justify-between"
          style={dashboardGlassCardStyle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CloudServerOutlined className="text-lg text-sky-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                Your Servers
              </span>
            </div>
            <ArrowRightOutlined className="text-xs text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-white font-['Sora'] m-0">{totalServers}</p>
            <p className="text-xs text-white/60 mt-1 m-0">
              {totalServers === 1 ? "Discord server connected" : "Discord servers connected"}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
