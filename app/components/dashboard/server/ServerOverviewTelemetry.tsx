import {
  ApartmentOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import type { ServerBridgeResource, ServerResource } from "~/resources/server";

export interface ServerOverviewTelemetryProps {
  server: ServerResource;
  bridges?: ServerBridgeResource[];
  bridgesCount?: number;
  blocksCount?: number;
}

export function ServerOverviewTelemetry({
  server,
  bridges = [],
  bridgesCount,
  blocksCount,
}: ServerOverviewTelemetryProps) {
  const totalBridges = typeof bridgesCount === "number" ? bridgesCount : bridges.length;
  const activeBridges = bridges.filter((b) => b.connected).length;
  const disconnectedWebhooks = bridges.filter((b) => b.webhookProvisioned === false).length;
  const isCallActive = Boolean(server.status.activeCall);
  const totalBlocks = typeof blocksCount === "number" ? blocksCount : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Connected Bridges Card */}
      <Link
        to={`/dashboard/servers/${server.metadata.id}/bridges`}
        className="group p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/40 shadow-[0_2px_0_0_rgba(255,255,255,0.06)] hover:shadow-[0_2px_0_0_#5b4ccb] transition-all flex flex-col justify-between gap-4 min-h-[140px]"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-white/70 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <ApartmentOutlined className="text-violet-300 text-sm" />
              <span>Connected Bridges</span>
            </div>
            <ArrowRightOutlined className="text-xs text-white/40 group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-['Sora']">
            {activeBridges} <span className="text-sm font-normal text-white/60">of {totalBridges} active</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
          {disconnectedWebhooks > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
              <ExclamationCircleOutlined />
              <span>{disconnectedWebhooks} channel disconnected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-300">
              <CheckCircleOutlined />
              <span>All messages delivering</span>
            </span>
          )}
          <span className="text-violet-300 group-hover:underline">Manage Bridges →</span>
        </div>
      </Link>

      {/* Text Calls Card */}
      <Link
        to={`/dashboard/servers/${server.metadata.id}/calls`}
        className="group p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-500/40 shadow-[0_2px_0_0_rgba(255,255,255,0.06)] hover:shadow-[0_2px_0_0_#d97706] transition-all flex flex-col justify-between gap-4 min-h-[140px]"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-white/70 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <ThunderboltOutlined className="text-amber-300 text-sm" />
              <span>Text Calls</span>
            </div>
            <ArrowRightOutlined className="text-xs text-white/40 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            {isCallActive ? (
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live call in progress
              </span>
            ) : (
              <span className="text-xl font-bold text-white font-['Sora']">Ready for calls</span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/70">
          <span>
            {server.spec.lobbyChannelIds.length > 0
              ? `${server.spec.lobbyChannelIds.length} designated channel(s)`
              : "Open to any text channel"}
          </span>
          <span className="text-amber-300 group-hover:underline">Call Settings →</span>
        </div>
      </Link>

      {/* Safety Shield Card */}
      <Link
        to={`/dashboard/servers/${server.metadata.id}/safety`}
        className="group p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-rose-500/40 shadow-[0_2px_0_0_rgba(255,255,255,0.06)] hover:shadow-[0_2px_0_0_#e11d48] transition-all flex flex-col justify-between gap-4 min-h-[140px]"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-white/70 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <SafetyCertificateOutlined className="text-rose-300 text-sm" />
              <span>Safety Shield</span>
            </div>
            <ArrowRightOutlined className="text-xs text-white/40 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-['Sora']">
            {totalBlocks}{" "}
            <span className="text-sm font-normal text-white/60">
              {totalBlocks === 1 ? "blocked member or server" : "blocked members & servers"}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/70">
          <span>Protection active</span>
          <span className="text-rose-300 group-hover:underline">View Blocklist →</span>
        </div>
      </Link>
    </div>
  );
}
