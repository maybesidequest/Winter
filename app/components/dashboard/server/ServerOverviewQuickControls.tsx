import { message } from "antd";
import { useRef, useState } from "react";
import { DepthToggle } from "~/components/dashboard/shared";
import { orpcClient as orpc } from "~/lib/orpc";
import type { ServerResource } from "~/resources/server";

export interface ServerOverviewQuickControlsProps {
  server: ServerResource;
  onServerUpdated?: () => void;
}

export function ServerOverviewQuickControls({ server, onServerUpdated }: ServerOverviewQuickControlsProps) {
  const isInstalled = server.status.botInstalled;
  const [pingOnMatch, setPingOnMatch] = useState(server.spec.pingOnMatch);
  const [filterNsfw, setFilterNsfw] = useState(server.spec.filterNsfw);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const handleToggle = async (key: "pingOnMatch" | "filterNsfw", nextValue: boolean) => {
    if (!isInstalled) return;
    if (!server.version) {
      message.error("Server version unavailable. Refresh before updating.");
      return;
    }

    if (key === "pingOnMatch") setPingOnMatch(nextValue);
    if (key === "filterNsfw") setFilterNsfw(nextValue);

    setSavingKey(key);
    try {
      await orpc.server.patchCallConfig({
        serverId: server.metadata.id,
        pingOnMatch: key === "pingOnMatch" ? nextValue : pingOnMatch,
        filterNsfw: key === "filterNsfw" ? nextValue : filterNsfw,
        autoRequeueOnSkip: server.spec.autoRequeueOnSkip,
        lobbyChannelIds: server.spec.lobbyChannelIds,
        expectedVersion: server.version,
        idempotencyKey: idempotencyKeyRef.current,
      });
      idempotencyKeyRef.current = crypto.randomUUID();
      message.success(
        key === "pingOnMatch"
          ? nextValue
            ? "Call match notifications enabled (Ping)."
            : "Call match notifications set to Silent."
          : nextValue
            ? "NSFW content filter enabled."
            : "NSFW content filter disabled.",
      );
      onServerUpdated?.();
    } catch (err: unknown) {
      // Revert optimistic state
      if (key === "pingOnMatch") setPingOnMatch(!nextValue);
      if (key === "filterNsfw") setFilterNsfw(!nextValue);
      message.error(err instanceof Error ? err.message : "Failed to update call posture.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] shadow-[0_2px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-white/80">Call Safety & Posture</span>
        <span className="text-xs text-white/60">Instant Quick-Toggles</span>
      </div>

      <div className="flex flex-col divide-y divide-white/[0.06]">
        {/* Match Notification Toggle */}
        <label
          htmlFor="overview-toggle-ping"
          className={`py-2.5 flex items-center justify-between gap-4 rounded-lg transition-colors ${
            isInstalled ? "cursor-pointer hover:bg-white/[0.02] group" : "opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">
              Match Alerts (Ping)
            </span>
            <span className="text-xs text-white/70">
              {pingOnMatch ? "Pings members when matched" : "Silent matching in channel"}
            </span>
          </div>
          <DepthToggle
            id="overview-toggle-ping"
            disabled={!isInstalled || savingKey === "pingOnMatch"}
            checked={pingOnMatch}
            onChange={(checked) => void handleToggle("pingOnMatch", checked)}
            aria-label="Toggle Call Match Alerts"
          />
        </label>

        {/* NSFW Filter Toggle */}
        <label
          htmlFor="overview-toggle-nsfw"
          className={`py-2.5 flex items-center justify-between gap-4 rounded-lg transition-colors ${
            isInstalled ? "cursor-pointer hover:bg-white/[0.02] group" : "opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">
              NSFW Media Filter
            </span>
            <span className="text-xs text-white/70">
              {filterNsfw ? "Scans and blocks explicit images" : "Unfiltered attachments"}
            </span>
          </div>
          <DepthToggle
            id="overview-toggle-nsfw"
            disabled={!isInstalled || savingKey === "filterNsfw"}
            checked={filterNsfw}
            onChange={(checked) => void handleToggle("filterNsfw", checked)}
            aria-label="Toggle NSFW Media Filter"
          />
        </label>
      </div>
    </div>
  );
}
