import { useState } from "react";
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
  ApiOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import { ConnectionOperationNotice } from "~/components/dashboard/connection/ConnectionOperationNotice";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { HubConnectionResource } from "~/resources/connection";

interface HubRoutesProps {
  connections: HubConnectionResource[];
  canManage: boolean;
  pending: boolean;
  onToggle: (connection: HubConnectionResource) => void;
  onDisconnect: (connection: HubConnectionResource) => void;
}

export function HubRoutes({
  connections,
  canManage,
  pending,
  onToggle,
  onDisconnect,
}: HubRoutesProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");

  const filtered = connections.filter((conn) => {
    const serverName = conn.status.serverName || "";
    const matchesSearch =
      serverName.toLowerCase().includes(search.toLowerCase()) ||
      Boolean(conn.status.channelName?.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === "active") return conn.spec.connected;
    if (statusFilter === "paused") return !conn.spec.connected;
    return true;
  });

  const activeCount = connections.filter((c) => c.spec.connected).length;
  const pausedCount = connections.filter((c) => !c.spec.connected).length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl w-full">
      {/* Header & Filter Bar */}
      <div className="rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={dashboardGlassCardStyle}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-lg text-violet-300">
            <ApiOutlined />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-['Sora'] m-0">Connected Discord Bridges</h3>
          <span className="text-xs text-white/50">{activeCount} enabled · {pausedCount} paused</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs" />
            <input
              type="text"
              placeholder="Search bridges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dashboard-input text-xs pl-8 py-1.5 min-h-[34px] w-48"
            />
          </div>

          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === "all" ? "bg-white/[0.12] text-white" : "text-white/50 hover:text-white"
              }`}
            >
              All ({connections.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === "active" ? "bg-white/[0.12] text-emerald-300" : "text-white/50 hover:text-white"
              }`}
            >
              Enabled ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("paused")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === "paused" ? "bg-white/[0.12] text-amber-300" : "text-white/50 hover:text-white"
              }`}
            >
              Paused ({pausedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Bridges List Card */}
      <div className="rounded-2xl border overflow-hidden flex flex-col" style={dashboardGlassCardStyle}>
        {filtered.length > 0 ? (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {filtered.map((connection) => (
              <div
                key={connection.metadata.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Identity */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-violet-950/60 border border-violet-400/20 flex items-center justify-center text-xs font-bold text-violet-300 flex-shrink-0 font-['Sora'] shadow-sm">
                    {(connection.status.serverName || "??").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate font-['Sora'] flex items-center gap-2">
                      <span>{connection.status.serverName || "Server name unavailable"}</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          connection.spec.connected
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${connection.spec.connected ? "bg-emerald-400" : "bg-amber-400"}`} />
                        {connection.spec.connected ? "Enabled" : "Paused"}
                      </span>
                    </div>
                    <div className="text-xs text-white/50 truncate mt-0.5">
                      {connection.status.channelName ? `#${connection.status.channelName}` : "Channel name unavailable"} ·{" "}
                      {connection.spec.connected ? "Relay enabled by configuration" : "Relay paused by manager"} ·{" "}
                      <span className={connection.status.healthy ? "text-emerald-300/80" : "text-amber-300"}>
                        {connection.status.healthy
                          ? "Observed health: healthy"
                          : `Observed health: ${connection.status.statusMessage || "needs attention"}`}
                      </span>
                    </div>
                    {connection.status.latestOperationId && <ConnectionOperationNotice operationId={connection.status.latestOperationId} />}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    disabled={!canManage || pending}
                    onClick={() => onToggle(connection)}
                    className="dashboard-btn-secondary px-3.5 py-1.5 text-xs font-bold"
                    title={connection.spec.connected ? "Pause message relay" : "Resume message relay"}
                  >
                    {connection.spec.connected ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    <span>{connection.spec.connected ? "Pause" : "Resume"}</span>
                  </button>

                  <Popconfirm
                    title="Disconnect bridge?"
                    description={`Remove ${connection.status.serverName || "this Server"} from the Hub.`}
                    okText="Disconnect"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onDisconnect(connection)}
                  >
                    <button
                      type="button"
                      disabled={!canManage || pending}
                      className="dashboard-btn-danger px-3.5 py-1.5 text-xs font-bold"
                      title="Disconnect bridge"
                    >
                      <StopOutlined />
                      <span>Disconnect</span>
                    </button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white/40">
              <ApiOutlined />
            </div>
            <h3 className="text-sm font-bold text-white font-['Sora'] m-0">No Connected Bridges Found</h3>
            <p className="text-xs text-white/50 max-w-sm m-0">
              {search ? "No bridges match your filter criteria." : "Connect a Discord channel via InterChat's /hub connect command or invite code."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
