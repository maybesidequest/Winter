import {
  ArrowRightOutlined,
  DisconnectOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerBridgeResource, ServerResource } from "~/resources/server";
import { ServerBridgeStatus } from "./ServerBridgeStatus";

interface ServerBridgeItemProps {
  server: ServerResource;
  bridge: ServerBridgeResource;
  channelName: string | null;
  pendingAction: { bridgeId: string; action: "toggle" | "repair" | "disconnect" } | null;
  onToggle: (bridge: ServerBridgeResource, isPaused: boolean) => void;
  onRepair: (bridge: ServerBridgeResource) => void;
  onDisconnect: (bridge: ServerBridgeResource) => void;
}

export function ServerBridgeItem({
  server: _server,
  bridge,
  channelName,
  pendingAction,
  onToggle,
  onRepair,
  onDisconnect,
}: ServerBridgeItemProps) {
  const isPaused = !bridge.connected;
  const needsAttention = bridge.connected && !bridge.healthy;
  const isBridgePending = pendingAction?.bridgeId === bridge.id;
  const isTogglePending = isBridgePending && pendingAction.action === "toggle";
  const isRepairPending = isBridgePending && pendingAction.action === "repair";
  const isDisconnectPending = isBridgePending && pendingAction.action === "disconnect";
  // Only Discord CDN avatars may be embedded; anything else is dropped so a
  // crafted hub icon cannot become a tracking pixel or mixed-content source.
  const safeHubIconUrl = /^https:\/\/cdn\.discordapp\.com\//.test(bridge.hubIconUrl ?? "")
    ? (bridge.hubIconUrl as string)
    : null;

  const statusBadge = needsAttention
    ? { label: "Degraded", dot: "bg-amber-400", classes: "bg-amber-500/15 text-amber-300 border-amber-500/30" }
    : isPaused
      ? { label: "Paused", dot: "bg-amber-400", classes: "bg-amber-500/15 text-amber-300 border-amber-500/30" }
      : { label: "Relay enabled", dot: "bg-emerald-400 animate-pulse", classes: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };

  const formattedDate = bridge.createdAt
    ? new Date(bridge.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "Unknown date";

  return (
    <div
      className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all duration-150 hover:border-white/15 ${isPaused || needsAttention ? "border-amber-500/30" : "border-white/[0.08]"
        }`}
      style={dashboardGlassCardStyle}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-white font-bold font-['Sora'] flex-shrink-0 overflow-hidden shadow-sm">
              {safeHubIconUrl ? (
                <img
                  src={safeHubIconUrl}
                  alt={bridge.hubName}
                  className="w-full h-full object-cover"
                />
              ) : (
                bridge.hubName.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white font-['Sora'] truncate">
                {bridge.hubName}
              </h4>
              <div className="text-xs text-white/70 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-white/60">Channel:</span>
                <span className="font-semibold text-sky-300">
                  #{channelName || "Channel name unavailable"}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${statusBadge.classes}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
            <span>{statusBadge.label}</span>
          </span>
        </div>

        <ServerBridgeStatus
          connected={bridge.connected}
          healthy={bridge.healthy}
          statusMessage={bridge.statusMessage}
          latestOperationId={bridge.latestOperationId}
        />

        {/* Diagnostic Webhook Warning */}
        {bridge.webhookProvisioned === false && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ExclamationCircleOutlined className="flex-shrink-0 text-rose-400" />
              <span>Discord webhook unprovisioned or missing.</span>
            </div>
            <button
              type="button"
              disabled={isBridgePending}
              onClick={() => onRepair(bridge)}
              className="text-xs font-bold text-sky-300 hover:text-sky-200 underline cursor-pointer p-1"
            >
              Repair Now
            </button>
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-xs text-white/70">
        <span>Connected {formattedDate}</span>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pause / Resume Button */}
          <button
            type="button"
            disabled={isBridgePending}
            className="dashboard-btn-secondary px-3 py-1.5 min-h-[36px] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            onClick={() => onToggle(bridge, isPaused)}
            title={isPaused ? "Resume message relay" : "Pause message relay"}
          >
            {isTogglePending ? (
              <LoadingOutlined />
            ) : isPaused ? (
              <PlayCircleOutlined className="text-emerald-400" />
            ) : (
              <PauseCircleOutlined className="text-amber-400" />
            )}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>

          {/* Webhook Repair Button */}
          <button
            type="button"
            disabled={isBridgePending}
            className="dashboard-btn-secondary px-3 py-1.5 min-h-[36px] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            onClick={() => onRepair(bridge)}
            title="Re-synchronize and repair Discord webhook"
          >
            {isRepairPending ? <LoadingOutlined /> : <ToolOutlined className="text-sky-400" />}
            <span>Repair</span>
          </button>

          {/* Disconnect Button */}
          <Popconfirm
            title="Disconnect this bridge?"
            description="Messages will stop routing between this channel and the Hub."
            okText="Disconnect"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDisconnect(bridge)}
          >
            <button
              type="button"
              disabled={isBridgePending}
              className="dashboard-btn-danger-subtle px-3 py-1.5 min-h-[36px] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              title="Remove bridge connection"
            >
              {isDisconnectPending ? <LoadingOutlined /> : <DisconnectOutlined />}
              <span>Disconnect</span>
            </button>
          </Popconfirm>

          {/* Hub Navigation Link */}
          {bridge.hubId && (
            <Link
              to={`/dashboard/hubs/${bridge.hubId}/overview`}
              className="dashboard-btn-secondary px-3 py-1.5 min-h-[36px] text-xs font-semibold text-violet-300 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Hub</span>
              <ArrowRightOutlined className="text-xs" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
