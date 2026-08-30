import { SaveOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { message, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { dashboardGlassCardStyle, DepthToggle } from "~/components/dashboard/shared";
import { orpcClient as orpc } from "~/lib/orpc";
import type { DiscordChannelResource, ServerResource } from "~/resources/server";

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
  onServerUpdated?: () => void;
}

export function ServerCallSettingsCard({ server, channels, onServerUpdated }: ServerCallSettingsCardProps) {
  const [spec, setSpec] = useState<CallSpec>(server.spec);
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState(server.version ?? 1);
  const [savedSpec, setSavedSpec] = useState<CallSpec>(server.spec);
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const isInstalled = server.status.botInstalled;

  useEffect(() => {
    setSpec(server.spec);
    setSavedSpec(server.spec);
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
      setSavedSpec(result.server?.spec ?? spec);
      setVersion(result.server?.version ?? version + 1);
      idempotencyKeyRef.current = crypto.randomUUID();
      onServerUpdated?.();
      message.success("Call settings saved successfully.");
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : "Failed to save call settings.";
      message.error(detail);
    } finally {
      setSaving(false);
    }
  };

  const isDirty =
    spec.pingOnMatch !== savedSpec.pingOnMatch ||
    spec.autoRequeueOnSkip !== savedSpec.autoRequeueOnSkip ||
    spec.filterNsfw !== savedSpec.filterNsfw ||
    JSON.stringify(spec.lobbyChannelIds) !== JSON.stringify(savedSpec.lobbyChannelIds);

  return (
    <div className="flex flex-col gap-6 w-full relative">
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

          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                type="button"
                onClick={() => setSpec(savedSpec)}
                disabled={saving}
                className="dashboard-btn-secondary px-3.5 py-2 text-xs"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isInstalled || saving || !isDirty}
              className={`dashboard-btn-primary px-5 py-2 text-xs flex-shrink-0 flex items-center gap-1.5 ${!isDirty ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <SaveOutlined />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
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
              label: ch.connectable ? `#${ch.name}` : `#${ch.name} — ${ch.rejectionReason || "Unavailable"}`,
              disabled: !ch.connectable,
            }))}
            style={{ width: "100%" }}
          />
          <span className="text-xs text-white/60">
            Restricts <code>/call</code> and <code>/groupcall</code> commands to the selected channels. If empty, calls can be initiated in any accessible channel.
          </span>
          {channels.length === 0 && <span className="text-xs text-amber-300">No connectable text channels were returned for this server.</span>}
        </div>

        <div className="h-[1px] bg-white/[0.08] w-full" />

        {/* Toggles */}
        <div className="flex flex-col divide-y divide-white/[0.06]">
          {TOGGLES.map((toggle) => {
            const isChecked = Boolean(spec[toggle.key]);
            return (
              <div
                key={toggle.key}
                onClick={() => isInstalled && updateToggle(toggle.key, !isChecked)}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 cursor-pointer group hover:bg-white/[0.02] px-2 -mx-2 rounded-xl transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">
                    {toggle.label}
                  </span>
                  <span className="text-xs text-white/70 max-w-xl">
                    {toggle.description}
                  </span>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <DepthToggle
                    disabled={!isInstalled}
                    checked={isChecked}
                    onChange={(checked) => updateToggle(toggle.key, checked)}
                    aria-label={toggle.label}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Unsaved Changes Banner */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-6 px-6 py-3.5 rounded-2xl bg-[#161426]/95 border border-violet-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-xs font-semibold text-white whitespace-nowrap">
            Careful — you have unsaved call changes!
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSpec(savedSpec)}
              disabled={saving}
              className="dashboard-btn-secondary px-3 py-1.5 text-xs"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="dashboard-btn-primary px-4 py-1.5 text-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <SaveOutlined />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
