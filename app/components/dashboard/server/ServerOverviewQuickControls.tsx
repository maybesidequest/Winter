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
      message.error("Could not reach Discord to verify your server. Please refresh and try again.");
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
            ? "📞 Calls will now ring in the channel when connected."
            : "🔇 Calls will connect silently without pings."
          : nextValue
            ? "🛡️ Explicit image filter enabled."
            : "⚠️ Explicit image filter turned off.",
      );
      onServerUpdated?.();
    } catch (err: unknown) {
      // Revert optimistic state
      if (key === "pingOnMatch") setPingOnMatch(!nextValue);
      if (key === "filterNsfw") setFilterNsfw(!nextValue);
      message.error(err instanceof Error ? err.message : "Could not update call settings. Please try again.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] shadow-[0_2px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 m-0">Call Safety & Behavior</h3>
        <span className="text-xs text-white/60">Quick Controls</span>
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
              Ring on Match
            </span>
            <span className="text-xs text-white/70">
              {pingOnMatch ? "Alerts the channel when another server connects" : "Silent connection (no pings)"}
            </span>
          </div>
          <DepthToggle
            id="overview-toggle-ping"
            disabled={!isInstalled || savingKey === "pingOnMatch"}
            checked={pingOnMatch}
            onChange={(checked) => void handleToggle("pingOnMatch", checked)}
            aria-label="Toggle Ring on Match"
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
              Block Explicit Images
            </span>
            <span className="text-xs text-white/70">
              {filterNsfw ? "AI scans and blocks adult images during calls" : "Allows all image attachments"}
            </span>
          </div>
          <DepthToggle
            id="overview-toggle-nsfw"
            disabled={!isInstalled || savingKey === "filterNsfw"}
            checked={filterNsfw}
            onChange={(checked) => void handleToggle("filterNsfw", checked)}
            aria-label="Toggle Block Explicit Images"
          />
        </label>
      </div>
    </div>
  );
}
