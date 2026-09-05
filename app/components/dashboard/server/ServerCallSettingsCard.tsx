import { SaveOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardSelect, dashboardGlassCardStyle, DepthToggle } from "~/components/dashboard/shared";
import { orpcClient as orpc } from "~/lib/orpc";
import type { DiscordChannelResource, ServerResource } from "~/resources/server";
import { ServerCallFloatingBanner } from "./ServerCallFloatingBanner";

type CallSpec = ServerResource["spec"];
type EditableCallKey = "pingOnMatch" | "autoRequeueOnSkip" | "filterNsfw";

const TOGGLES: Array<{ key: EditableCallKey; label: string; description: string }> = [
  {
    key: "pingOnMatch",
    label: "Ring on call match",
    description: "Send a notification in the channel when another server connects so your members know someone picked up.",
  },
  {
    key: "autoRequeueOnSkip",
    label: "Find next server if skipped",
    description: "If the other party hangs up or skips, automatically search for a new connection without having to run the command again.",
  },
  {
    key: "filterNsfw",
    label: "Block explicit images",
    description: "AI automatically scans image attachments during calls and blocks adult content to keep your server safe.",
  },
];

interface ServerCallSettingsCardProps {
  server: ServerResource;
  channels: DiscordChannelResource[];
  channelsLoading?: boolean;
  onServerUpdated?: () => void;
}

function channelsEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

export function ServerCallSettingsCard({ server, channels, channelsLoading = false, onServerUpdated }: ServerCallSettingsCardProps) {
  const [spec, setSpec] = useState<CallSpec>(server.spec);
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState<number | null>(server.version ?? null);
  const [savedSpec, setSavedSpec] = useState<CallSpec>(server.spec);
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const isInstalled = server.status.botInstalled;

  useEffect(() => {
    setSpec(server.spec);
    setSavedSpec(server.spec);
    setVersion(server.version ?? null);
  }, [server]);

  const handleSave = async () => {
    if (!isInstalled || !version) {
      message.error("Could not reach Discord to verify server state. Please refresh the page and try again.");
      return;
    }
    setSaving(true);
    try {
      const result = await orpc.server.patchCallConfig({
        serverId: server.metadata.id,
        pingOnMatch: spec.pingOnMatch,
        autoRequeueOnSkip: spec.autoRequeueOnSkip,
        filterNsfw: spec.filterNsfw,
        lobbyChannelIds: spec.lobbyChannelIds,
        expectedVersion: version,
        idempotencyKey: idempotencyKeyRef.current,
      });
      setSavedSpec(result.server?.spec ?? spec);
      setVersion(result.server?.version ?? null);
      idempotencyKeyRef.current = crypto.randomUUID();
      onServerUpdated?.();
      message.success("Call settings saved! Your server is ready for calls.");
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Failed to save call settings.");
    } finally {
      setSaving(false);
    }
  };

  const isDirty = useMemo(() => {
    return (
      spec.pingOnMatch !== savedSpec.pingOnMatch ||
      spec.autoRequeueOnSkip !== savedSpec.autoRequeueOnSkip ||
      spec.filterNsfw !== savedSpec.filterNsfw ||
      !channelsEqual(spec.lobbyChannelIds, savedSpec.lobbyChannelIds)
    );
  }, [spec, savedSpec]);

  return (
    <div className="flex flex-col gap-6 w-full relative">
      <div className="p-6 md:p-8 rounded-2xl border flex flex-col gap-6" style={dashboardGlassCardStyle}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-lg">
              <ThunderboltOutlined />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Sora']">Text Calls & Userphone</h2>
              <p className="text-xs text-white/70">
                Choose how {server.metadata.name} connects in random 1-on-1 and group text calls with other Discord communities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                type="button"
                onClick={() => setSpec(savedSpec)}
                disabled={saving}
                className="dashboard-btn-secondary px-4 py-2 text-xs min-h-[44px] cursor-pointer"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isInstalled || !version || saving || !isDirty}
              className={`dashboard-btn-primary px-5 py-2 text-xs min-h-[44px] flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${!isDirty ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <SaveOutlined />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Allowed Channels Picker */}
        <div className="flex flex-col gap-2">
          <label htmlFor="call-channels" className="text-xs font-bold uppercase tracking-wider text-white/80">Allowed Call Channels</label>
          <DashboardSelect
            id="call-channels"
            aria-label="Allowed Call Channels"
            mode="multiple"
            disabled={!isInstalled}
            loading={channelsLoading}
            value={spec.lobbyChannelIds}
            onChange={(ids) => setSpec((prev) => ({ ...prev, lobbyChannelIds: ids }))}
            maxCount={1}
            placeholder="Select specific text channels (leave empty to allow all)"
            className="w-full"
            options={channels.map((ch) => ({
              value: ch.id,
              label: ch.connectable ? `#${ch.name}` : `#${ch.name} — ${ch.rejectionReason || "Unavailable"}`,
              disabled: !ch.connectable,
            }))}
            style={{ width: "100%" }}
          />
          <span className="text-xs text-white/70">
            Limit <code>/call</code> and <code>/groupcall</code> commands to these channels. If empty, members can start calls in any text channel the bot can see.
          </span>
          {channels.length === 0 && <span className="text-xs text-amber-300">No accessible text channels found for this server.</span>}
        </div>

        <div className="h-[1px] bg-white/[0.08] w-full" />

        {/* Semantic Toggles with Accessible Labels */}
        <div className="flex flex-col divide-y divide-white/[0.06]">
          {TOGGLES.map((toggle) => {
            const isChecked = Boolean(spec[toggle.key]);
            const toggleId = `toggle-${toggle.key}`;
            return (
              <label
                key={toggle.key}
                htmlFor={toggleId}
                className={`py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 px-2 -mx-2 rounded-xl transition-colors ${isInstalled ? "cursor-pointer hover:bg-white/[0.02] group" : "opacity-60 cursor-not-allowed"}`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">{toggle.label}</span>
                  <span className="text-xs text-white/70 max-w-xl">{toggle.description}</span>
                </div>
                <DepthToggle
                  id={toggleId}
                  disabled={!isInstalled}
                  checked={isChecked}
                  onChange={(checked) => setSpec((prev) => ({ ...prev, [toggle.key]: checked }))}
                  aria-label={toggle.label}
                />
              </label>
            );
          })}
        </div>
      </div>

      {isDirty && (
        <ServerCallFloatingBanner saving={saving} onReset={() => setSpec(savedSpec)} onSave={handleSave} />
      )}
    </div>
  );
}
