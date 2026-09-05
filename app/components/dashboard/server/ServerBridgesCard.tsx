import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useMemo, useRef, useState } from "react";
import { ConnectChannelWizard } from "~/components/dashboard/connection/ConnectChannelWizard";
import { orpc } from "~/lib/orpc";
import type { DiscordChannelResource, ServerBridgeResource, ServerResource } from "~/resources/server";
import { ServerBridgeItem } from "./ServerBridgeItem";
import { ServerBridgesEmptyState } from "./ServerBridgesEmptyState";
import { ServerBridgesToolbar } from "./ServerBridgesToolbar";

interface ServerBridgesCardProps {
  server: ServerResource;
  bridges: ServerBridgeResource[];
  channels?: DiscordChannelResource[];
  onServerUpdated?: () => void;
}

export function ServerBridgesCard({ server, bridges, channels = [], onServerUpdated }: ServerBridgesCardProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [pendingActions, setPendingActions] = useState<Record<string, "toggle" | "repair" | "disconnect">>({});

  const markPending = (bridgeId: string, action: "toggle" | "repair" | "disconnect") =>
    setPendingActions((current) => ({ ...current, [bridgeId]: action }));
  const clearPending = (bridgeId: string) =>
    setPendingActions((current) => {
      if (!(bridgeId in current)) return current;
      const { [bridgeId]: _cleared, ...rest } = current;
      return rest;
    });

  const actionKeysRef = useRef(new Map<string, string>());
  const keyFor = (action: string, bridgeId: string) => {
    const key = `${action}:${bridgeId}`;
    const existing = actionKeysRef.current.get(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    actionKeysRef.current.set(key, created);
    return created;
  };

  const channelMap = useMemo(() => new Map(channels.map((c) => [c.id, c.name])), [channels]);

  const refreshBridges = () => {
    void queryClient.invalidateQueries({
      queryKey: orpc.server.bridges.queryOptions({ input: { serverId: server.metadata.id } }).queryKey,
    });
  };

  const toggleMutation = useMutation(
    orpc.server.toggleBridge.mutationOptions({
      onSuccess: (_res, variables) => {
        actionKeysRef.current.delete(`toggle:${variables.connectionId}`);
        message.success(variables.enabled ? "Bridge resumed." : "Bridge paused.");
        refreshBridges();
      },
      onError: (err) => {
        refreshBridges();
        message.error(err instanceof Error ? err.message : "Unable to update this bridge.");
      },
    }),
  );

  const repairMutation = useMutation(
    orpc.server.repairBridge.mutationOptions({
      onSuccess: (_res, variables) => {
        actionKeysRef.current.delete(`repair:${variables.connectionId}`);
        message.success("Bridge webhooks repaired.");
        refreshBridges();
      },
      onError: (err) => {
        refreshBridges();
        message.error(err instanceof Error ? err.message : "Unable to repair this bridge.");
      },
    }),
  );

  const disconnectMutation = useMutation(
    orpc.server.disconnectBridge.mutationOptions({
      onSuccess: (_res, variables) => {
        actionKeysRef.current.delete(`disconnect:${variables.connectionId}`);
        message.success("Bridge disconnected.");
        refreshBridges();
        onServerUpdated?.();
      },
      onError: (err) => {
        refreshBridges();
        message.error(err instanceof Error ? err.message : "Unable to disconnect this bridge.");
      },
    }),
  );

  const handleToggle = (bridge: ServerBridgeResource, isPaused: boolean) => {
    markPending(bridge.id, "toggle");
    toggleMutation.mutate(
      { serverId: server.metadata.id, connectionId: bridge.id, enabled: isPaused, expectedVersion: bridge.version, idempotencyKey: keyFor("toggle", bridge.id) },
      { onSettled: () => clearPending(bridge.id) },
    );
  };

  const handleRepair = (bridge: ServerBridgeResource) => {
    markPending(bridge.id, "repair");
    repairMutation.mutate(
      { serverId: server.metadata.id, connectionId: bridge.id, expectedVersion: bridge.version, idempotencyKey: keyFor("repair", bridge.id) },
      { onSettled: () => clearPending(bridge.id) },
    );
  };

  const handleDisconnect = (bridge: ServerBridgeResource) => {
    markPending(bridge.id, "disconnect");
    disconnectMutation.mutate(
      { serverId: server.metadata.id, connectionId: bridge.id, expectedVersion: bridge.version, idempotencyKey: keyFor("disconnect", bridge.id) },
      { onSettled: () => clearPending(bridge.id) },
    );
  };

  const activeCount = useMemo(() => bridges.filter((b) => b.connected).length, [bridges]);
  const pausedCount = useMemo(() => bridges.filter((b) => !b.connected).length, [bridges]);

  const filteredBridges = useMemo(() => {
    return bridges.filter((bridge) => {
      const chName = bridge.channelName || channelMap.get(bridge.channelId) || "";
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || bridge.hubName.toLowerCase().includes(query) || chName.toLowerCase().includes(query);
      if (!matchesSearch) return false;
      const isPaused = !bridge.connected;
      if (statusFilter === "active") return !isPaused;
      if (statusFilter === "paused") return isPaused;
      return true;
    });
  }, [bridges, channelMap, search, statusFilter]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <ServerBridgesToolbar
        activeCount={activeCount}
        pausedCount={pausedCount}
        totalCount={bridges.length}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenWizard={() => setWizardOpen(true)}
      />

      {bridges.length === 0 || filteredBridges.length === 0 ? (
        <ServerBridgesEmptyState
          isFiltered={bridges.length > 0 && filteredBridges.length === 0}
          onOpenWizard={() => setWizardOpen(true)}
          onResetFilters={() => {
            setSearch("");
            setStatusFilter("all");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBridges.map((bridge) => (
            <ServerBridgeItem
              key={bridge.id}
              server={server}
              bridge={bridge}
              channelName={bridge.channelName || channelMap.get(bridge.channelId) || null}
              pendingAction={pendingActions[bridge.id] ? { bridgeId: bridge.id, action: pendingActions[bridge.id] } : null}
              onToggle={handleToggle}
              onRepair={handleRepair}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}

      <ConnectChannelWizard
        server={server}
        channels={channels}
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onConnected={() => {
          refreshBridges();
          onServerUpdated?.();
        }}
      />
    </div>
  );
}
