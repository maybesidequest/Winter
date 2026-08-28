import {
  ArrowRightOutlined,
  DisconnectOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerBridgeResource, ServerResource } from "~/resources/server";

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
  const isPaused = bridge.pausedByBot || !bridge.connected;
  const isBridgePending = pendingAction?.bridgeId === bridge.id;
  const isTogglePending = isBridgePending && pendingAction.action === "toggle";
  const isRepairPending = isBridgePending && pendingAction.action === "repair";
  const isDisconnectPending = isBridgePending && pendingAction.action === "disconnect";

  const formattedDate = bridge.createdAt
    ? new Date(bridge.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "Unknown date";

  return (
    <div
      className="p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all duration-150 hover:border-white/15"
      style={{
        ...dashboardGlassCardStyle,
        borderColor: isPaused ? "rgba(245, 158, 11, 0.3)" : "rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-white font-bold font-['Sora'] flex-shrink-0 overflow-hidden shadow-sm">
              {bridge.hubIconUrl ? (
                <img
                  src={bridge.hubIconUrl}
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
                <span className="text-white/50">Channel:</span>
                <span className="font-semibold text-sky-300">
                  #{channelName || `channel-${bridge.channelId}`}
                </span>
                <span className="text-[10px] font-mono text-white/40 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                  {bridge.channelId}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 ${!isPaused
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${!isPaused ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
            />
            <span>{!isPaused ? "Live Relay" : "Paused"}</span>
          </span>
        </div>

        {/* Diagnostic Webhook Warning */}
        {bridge.webhookProvisioned === false && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ExclamationCircleOutlined className="flex-shrink-0 text-rose-400" />
              <span>Discord webhook unprovisioned or missing.</span>
            </div>
            <button
              type="button"
              disabled={isBridgePending}
              onClick={() => onRepair(bridge)}
              className="text-[11px] font-bold text-sky-300 hover:text-sky-200 underline cursor-pointer"
            >
              Repair Now
            </button>
          </div>
        )}

        {/* Pause Reason Info */}
        {isPaused && bridge.pauseReason && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
            <InfoCircleOutlined className="flex-shrink-0 text-amber-400" />
            <span>Reason: {bridge.pauseReason}</span>
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-xs text-white/50">
        <span>Connected {formattedDate}</span>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pause / Resume Button */}
          <button
            type="button"
            disabled={isBridgePending}
            className="dashboard-btn-secondary px-3 py-1.5 text-xs font-semibold"
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
            className="dashboard-btn-secondary px-3 py-1.5 text-xs font-semibold"
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
              className="dashboard-btn-danger-subtle px-3 py-1.5 text-xs font-semibold"
              title="Remove bridge connection"
            >
              {isDisconnectPending ? <LoadingOutlined /> : <DisconnectOutlined />}
              <span>Disconnect</span>
            </button>
          </Popconfirm>

          {/* Hub Navigation Link */}
          {bridge.hubId && (
            <Link
              to={`/dashboard/hubs/${bridge.hubId}`}
              className="dashboard-btn-secondary px-3 py-1.5 text-xs font-semibold text-violet-300 hover:text-white flex items-center gap-1.5"
            >
              <span>Hub</span>
              <ArrowRightOutlined className="text-[10px]" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
