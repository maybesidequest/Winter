import { useState, useEffect, useRef } from "react";
import { Select, message } from "antd";
import { SaveOutlined, LockOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { dashboardGlassCardStyle, DepthToggle } from "~/components/dashboard/shared";
import type { DiscordChannelResource, ServerResource } from "~/resources/server";
import { orpcClient as orpc } from "~/lib/orpc";

type CallSpec = ServerResource["spec"];
type EditableCallKey = "pingOnMatch" | "autoRequeueOnSkip" | "filterNsfw";

const TOGGLES: Array<{
  key: EditableCallKey;
  label: string;
  description: string;
}> = [
  {
    key: "pingOnMatch",
    label: "Ping on match",
    description: "Send a notification ping in the call channel when another server connects.",
  },
  {
    key: "autoRequeueOnSkip",
    label: "Requeue after skip",
    description: "Automatically search for another text Call after a participant skips the match.",
  },
  {
    key: "filterNsfw",
    label: "Filter NSFW / explicit images",
    description: "Automatically scan and block explicit imagery from being shown to your server members during calls.",
  },
];

interface ServerCallSettingsCardProps {
  server: ServerResource;
  channels: DiscordChannelResource[];
}

export function ServerCallSettingsCard({ server, channels }: ServerCallSettingsCardProps) {
  const [spec, setSpec] = useState<CallSpec>(server.spec);
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState(server.version ?? 1);
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const isInstalled = server.status.botInstalled;

  useEffect(() => {
    setSpec(server.spec);
    setVersion(server.version ?? 1);
  }, [server]);

  const updateToggle = (key: EditableCallKey, value: boolean) => {
    setSpec((prev) => ({ ...prev, [key]: value }));
  };

  const updateChannels = (channelIds: string[]) => {
    setSpec((prev) => ({ ...prev, lobbyChannelIds: channelIds }));
  };

  const handleSave = async () => {
    if (!isInstalled) return;
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
      setVersion(result.server?.version ?? version + 1);
      idempotencyKeyRef.current = crypto.randomUUID();
      message.success("Call settings saved successfully.");
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : "Failed to save call settings.";
      message.error(detail);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div
        className="p-6 md:p-8 rounded-2xl border flex flex-col gap-6"
        style={dashboardGlassCardStyle}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-lg">
              <ThunderboltOutlined />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Sora']">
                Userphone & Call Configuration
              </h2>
              <p className="text-xs text-white/60">
                Configure how {server.metadata.name} behaves in ephemeral 1:1 and group text calls.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isInstalled || saving}
            className="dashboard-btn-primary px-5 py-2.5 text-xs flex-shrink-0"
          >
            <SaveOutlined />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        {/* Allowed Channels Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/80">
            Allowed Call Channels
          </label>
          <Select
            mode="multiple"
            disabled={!isInstalled}
            value={spec.lobbyChannelIds}
            onChange={updateChannels}
            maxCount={1}
            placeholder="Select specific text channels (leave empty to allow all)"
            className="w-full custom-glass-select"
            options={channels.map((ch) => ({
              value: ch.id,
              label: `#${ch.name}`,
            }))}
            style={{ width: "100%" }}
          />
          <span className="text-xs text-white/50">
            Restricts <code>/call</code> and <code>/groupcall</code> commands to the selected channels. If empty, calls can be initiated in any accessible channel.
          </span>
        </div>

        <div className="h-[1px] bg-white/[0.06] w-full" />

        {/* Toggles */}
        <div className="flex flex-col divide-y divide-white/[0.06]">
          {TOGGLES.map((toggle) => (
            <div
              key={toggle.key}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white">
                  {toggle.label}
                </span>
                <span className="text-xs text-white/60 max-w-xl">
                  {toggle.description}
                </span>
              </div>
              <DepthToggle
                disabled={!isInstalled}
                checked={Boolean(spec[toggle.key])}
                onChange={(checked) => updateToggle(toggle.key, checked)}
                aria-label={toggle.label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
