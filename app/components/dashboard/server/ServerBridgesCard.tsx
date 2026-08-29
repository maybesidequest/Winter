import {
  ApartmentOutlined,
  ArrowRightOutlined,
  CompassOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useMemo, useRef, useState } from "react";
import { Link, useRevalidator } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { orpc } from "~/lib/orpc";
import type { DiscordChannelResource, ServerBridgeResource, ServerResource } from "~/resources/server";
import { ServerBridgeItem } from "./ServerBridgeItem";

interface ServerBridgesCardProps {
  server: ServerResource;
  bridges: ServerBridgeResource[];
  channels?: DiscordChannelResource[];
}

export function ServerBridgesCard({ server, bridges, channels = [] }: ServerBridgesCardProps) {
  const revalidator = useRevalidator();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");
  const [pendingAction, setPendingAction] = useState<{
    bridgeId: string;
    action: "toggle" | "repair" | "disconnect";
  } | null>(null);

  const actionKeysRef = useRef(new Map<string, string>());
  const keyFor = (action: string, bridgeId: string) => {
    const key = `${action}:${bridgeId}`;
    const existing = actionKeysRef.current.get(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    actionKeysRef.current.set(key, created);
    return created;
  };

  const channelMap = useMemo(() => {
    return new Map(channels.map((c) => [c.id, c.name]));
  }, [channels]);

  const toggleMutation = useMutation(
    orpc.server.toggleBridge.mutationOptions({
      onSuccess: (_result, variables) => {
        actionKeysRef.current.delete(`toggle:${variables.connectionId}`);
        message.success(variables.enabled ? "Bridge resumed." : "Bridge paused.");
        revalidator.revalidate();
      },
      onError: (error) => {
        revalidator.revalidate();
        message.error(error instanceof Error ? error.message : "Unable to update this bridge.");
      },
    }),
  );

  const repairMutation = useMutation(
    orpc.server.repairBridge.mutationOptions({
      onSuccess: (_result, variables) => {
        actionKeysRef.current.delete(`repair:${variables.connectionId}`);
        message.success("Bridge webhooks repaired.");
        revalidator.revalidate();
      },
      onError: (error) => {
        revalidator.revalidate();
        message.error(error instanceof Error ? error.message : "Unable to repair this bridge.");
      },
    }),
  );

  const disconnectMutation = useMutation(
    orpc.server.disconnectBridge.mutationOptions({
      onSuccess: (_result, variables) => {
        actionKeysRef.current.delete(`disconnect:${variables.connectionId}`);
        message.success("Bridge disconnected.");
        revalidator.revalidate();
      },
      onError: (error) => {
        revalidator.revalidate();
        message.error(error instanceof Error ? error.message : "Unable to disconnect this bridge.");
      },
    }),
  );

  const handleToggle = (bridge: ServerBridgeResource, isPaused: boolean) => {
    setPendingAction({ bridgeId: bridge.id, action: "toggle" });
    toggleMutation.mutate(
      {
        serverId: server.metadata.id,
        connectionId: bridge.id,
        enabled: isPaused,
        expectedVersion: bridge.version,
        idempotencyKey: keyFor("toggle", bridge.id),
      },
      {
        onSettled: () => setPendingAction(null),
      },
    );
  };

  const handleRepair = (bridge: ServerBridgeResource) => {
    setPendingAction({ bridgeId: bridge.id, action: "repair" });
    repairMutation.mutate(
      {
        serverId: server.metadata.id,
        connectionId: bridge.id,
        expectedVersion: bridge.version,
        idempotencyKey: keyFor("repair", bridge.id),
      },
      {
        onSettled: () => setPendingAction(null),
      },
    );
  };

  const handleDisconnect = (bridge: ServerBridgeResource) => {
    setPendingAction({ bridgeId: bridge.id, action: "disconnect" });
    disconnectMutation.mutate(
      {
        serverId: server.metadata.id,
        connectionId: bridge.id,
        expectedVersion: bridge.version,
        idempotencyKey: keyFor("disconnect", bridge.id),
      },
      {
        onSettled: () => setPendingAction(null),
      },
    );
  };

  const activeCount = useMemo(
    () => bridges.filter((b) => !b.pausedByBot && b.connected).length,
    [bridges],
  );
  const pausedCount = useMemo(
    () => bridges.filter((b) => b.pausedByBot || !b.connected).length,
    [bridges],
  );

  const filteredBridges = useMemo(() => {
    return bridges.filter((bridge) => {
      const chName = bridge.channelName || channelMap.get(bridge.channelId) || "";
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        bridge.hubName.toLowerCase().includes(query) ||
        chName.toLowerCase().includes(query) ||
        bridge.channelId.includes(query);

      if (!matchesSearch) return false;
      const isPaused = bridge.pausedByBot || !bridge.connected;
      if (statusFilter === "active") return !isPaused;
      if (statusFilter === "paused") return isPaused;
      return true;
    });
  }, [bridges, channelMap, search, statusFilter]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Information & Filter Toolbar */}
      <div
        className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={dashboardGlassCardStyle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-lg shadow-sm">
            <ApartmentOutlined />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-['Sora'] m-0">
              Connected Hub Bridges
            </h2>
            <p className="text-xs text-white/50 m-0 mt-0.5">
              {activeCount} active · {pausedCount} paused · {bridges.length} total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search input */}
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs" />
            <input
              type="text"
              placeholder="Search bridges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dashboard-input text-xs pl-8 py-1.5 min-h-[34px] w-44 sm:w-48"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`dashboard-pill-btn ${statusFilter === "all" ? "dashboard-pill-btn--active" : ""}`}
            >
              All ({bridges.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`dashboard-pill-btn ${statusFilter === "active" ? "dashboard-pill-btn--active" : ""}`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("paused")}
              className={`dashboard-pill-btn ${statusFilter === "paused" ? "dashboard-pill-btn--active" : ""}`}
            >
              Paused ({pausedCount})
            </button>
          </div>

          {/* Hub Directory Link */}
          <Link
            to="/dashboard/browse"
            className="dashboard-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            title="Browse all available public hubs"
          >
            <CompassOutlined />
            <span>Browse Hubs</span>
          </Link>
        </div>
      </div>

      {/* Bridges Content */}
      {bridges.length === 0 ? (
        <div
          className="p-8 md:p-12 rounded-2xl border flex flex-col items-center justify-center text-center gap-4"
          style={dashboardGlassCardStyle}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl">
            <ApartmentOutlined />
          </div>
          <div className="flex flex-col gap-1.5 max-w-md">
            <h3 className="text-base font-bold text-white font-['Sora']">
              No Connected Bridges
            </h3>
            <p className="text-xs text-white/70">
              This server has not bridged any channels to an InterChat Hub yet. You can connect channels to a Hub directly from Discord:
            </p>
            <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs font-mono text-violet-300">
              <code>/hub join &lt;hub_name&gt;</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("/hub join ");
                  message.success("Command copied to clipboard");
                }}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
                title="Copy command"
              >
                Copy
              </button>
            </div>
          </div>
          <Link
            to="/dashboard/browse"
            className="dashboard-btn-primary px-5 py-2.5 text-xs font-semibold mt-2 flex items-center gap-2"
          >
            <span>Explore Hub Directory</span>
            <ArrowRightOutlined className="text-[10px]" />
          </Link>
        </div>
      ) : filteredBridges.length === 0 ? (
        <div
          className="p-8 rounded-2xl border flex flex-col items-center justify-center text-center gap-2"
          style={dashboardGlassCardStyle}
        >
          <p className="text-sm font-semibold text-white/80">No bridges match your filter</p>
          <p className="text-xs text-white/50">Try clearing your search query or selecting &quot;All&quot;.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="dashboard-btn-secondary px-3.5 py-1.5 text-xs font-semibold mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBridges.map((bridge) => {
            const resolvedChannel = bridge.channelName || channelMap.get(bridge.channelId) || null;
            return (
              <ServerBridgeItem
                key={bridge.id}
                server={server}
                bridge={bridge}
                channelName={resolvedChannel}
                pendingAction={pendingAction}
                onToggle={handleToggle}
                onRepair={handleRepair}
                onDisconnect={handleDisconnect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
