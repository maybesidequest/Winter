import {
  ApartmentOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link, useRevalidator } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Popconfirm, message } from "antd";
import { useRef } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerBridgeResource, ServerResource } from "~/resources/server";
import { orpc } from "~/lib/orpc";

interface ServerBridgesCardProps {
  server: ServerResource;
  bridges: ServerBridgeResource[];
}

export function ServerBridgesCard({ server, bridges }: ServerBridgesCardProps) {
  const revalidator = useRevalidator();
  const actionKeysRef = useRef(new Map<string, string>());
  const keyFor = (action: string, bridgeId: string) => {
    const key = `${action}:${bridgeId}`;
    const existing = actionKeysRef.current.get(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    actionKeysRef.current.set(key, created);
    return created;
  };

  const toggleMutation = useMutation(
    orpc.server.toggleBridge.mutationOptions({
      onSuccess: (_result, variables) => {
        actionKeysRef.current.delete(`toggle:${variables.connectionId}`);
        message.success(variables.enabled ? "Bridge resumed." : "Bridge paused.");
        revalidator.revalidate();
      },
      onError: (error) => message.error(error instanceof Error ? error.message : "Unable to update this bridge."),
    }),
  );
  const repairMutation = useMutation(
    orpc.server.repairBridge.mutationOptions({
      onSuccess: (_result, variables) => {
        actionKeysRef.current.delete(`repair:${variables.connectionId}`);
        message.success("Bridge webhooks repaired.");
        revalidator.revalidate();
      },
      onError: (error) => message.error(error instanceof Error ? error.message : "Unable to repair this bridge."),
    }),
  );
  const disconnectMutation = useMutation(
    orpc.server.disconnectBridge.mutationOptions({
      onSuccess: (_result, variables) => {
        actionKeysRef.current.delete(`disconnect:${variables.connectionId}`);
        message.success("Bridge disconnected.");
        revalidator.revalidate();
      },
      onError: (error) => message.error(error instanceof Error ? error.message : "Unable to disconnect this bridge."),
    }),
  );
  const actionPending = toggleMutation.isPending || repairMutation.isPending || disconnectMutation.isPending;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Information Header */}
      <div
        className="p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={dashboardGlassCardStyle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
            <ApartmentOutlined />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-['Sora']">
              Connected Hub Bridges
            </h2>
            <p className="text-xs text-white/60">
              Active channel bridges connecting {server.metadata.name} to persistent cross-server Hubs.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80 self-start sm:self-auto">
          <span>Total Bridges:</span>
          <span className="font-bold text-white font-mono">{bridges.length}</span>
        </div>
      </div>

      {/* Bridges List */}
      {bridges.length === 0 ? (
        <div
          className="p-8 md:p-12 rounded-2xl border flex flex-col items-center justify-center text-center gap-4"
          style={dashboardGlassCardStyle}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-2xl">
            <ApartmentOutlined />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-base font-bold text-white font-['Sora']">
              No Connected Bridges
            </h3>
            <p className="text-xs text-white/60">
              This server has not bridged any channels to an InterChat Hub yet. You can connect channels to a Hub in Discord using the <code>/hub join &lt;hub_name&gt;</code> command.
            </p>
          </div>
          <Link
            to="/dashboard/browse"
            className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold mt-2"
          >
            <span>Explore Hub Directory</span>
            <ArrowRightOutlined className="text-[10px]" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bridges.map((bridge) => {
            const isPaused = bridge.pausedByBot || !bridge.connected;

            return (
              <div
                key={bridge.id}
                className="p-5 rounded-2xl border flex flex-col justify-between gap-4"
                style={{
                  ...dashboardGlassCardStyle,
                  borderColor: isPaused ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-white font-bold font-['Sora'] flex-shrink-0 overflow-hidden">
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
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Sora'] flex items-center gap-2">
                        <span>{bridge.hubName}</span>
                      </h4>
                      <span className="text-xs text-white/60">
                        Channel: <code className="text-sky-300 font-mono">#{bridge.channelId}</code>
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      !isPaused
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                    }`}
                  >
                    {!isPaused ? (
                      <>
                        <CheckCircleOutlined />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <PauseCircleOutlined />
                        <span>Paused</span>
                      </>
                    )}
                  </span>
                </div>

                {isPaused && bridge.pauseReason && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
                    <InfoCircleOutlined className="flex-shrink-0" />
                    <span>Reason: {bridge.pauseReason}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-white/50">
                  <span>Connected on {new Date(bridge.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={actionPending}
                      className="text-amber-300 hover:text-amber-200 font-semibold disabled:opacity-50"
                      onClick={() =>
                        toggleMutation.mutate(
                          {
                            serverId: server.metadata.id,
                            connectionId: bridge.id,
                            enabled: isPaused,
                            expectedVersion: bridge.version,
                            idempotencyKey: keyFor("toggle", bridge.id),
                          },
                          { onSuccess: () => actionKeysRef.current.delete(`toggle:${bridge.id}`) },
                        )
                      }
                    >
                      {isPaused ? "Resume" : "Pause"}
                    </button>
                    <button
                      type="button"
                      disabled={actionPending}
                      className="text-sky-300 hover:text-sky-200 font-semibold disabled:opacity-50"
                      onClick={() =>
                        repairMutation.mutate(
                          {
                            serverId: server.metadata.id,
                            connectionId: bridge.id,
                            idempotencyKey: keyFor("repair", bridge.id),
                          },
                          { onSuccess: () => actionKeysRef.current.delete(`repair:${bridge.id}`) },
                        )
                      }
                    >
                      Repair
                    </button>
                    <Popconfirm
                      title="Disconnect this bridge?"
                      description="Messages will stop routing between this channel and the Hub."
                      okText="Disconnect"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() =>
                        disconnectMutation.mutate(
                          {
                            serverId: server.metadata.id,
                            connectionId: bridge.id,
                            idempotencyKey: keyFor("disconnect", bridge.id),
                          },
                          { onSuccess: () => actionKeysRef.current.delete(`disconnect:${bridge.id}`) },
                        )
                      }
                    >
                      <button type="button" disabled={actionPending} className="text-red-300 hover:text-red-200 font-semibold disabled:opacity-50">
                        Disconnect
                      </button>
                    </Popconfirm>
                    <Link
                      to={`/dashboard/hubs/${bridge.hubId}`}
                      className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>View Hub</span>
                      <ArrowRightOutlined className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
