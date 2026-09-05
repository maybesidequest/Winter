import {
  CheckCircleOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { orpcClient as orpc } from "~/lib/orpc";
import type { ServerResource } from "~/resources/server";
import { ServerPermissionsGrid } from "./ServerPermissionsGrid";

interface ServerSettingsCardProps {
  server: ServerResource;
  botClientId?: string;
  onServerUpdated?: () => void;
}

export function ServerSettingsCard({
  server,
  botClientId = "798748015435055134",
  onServerUpdated,
}: ServerSettingsCardProps) {
  const [copied, setCopied] = useState(false);
  const [prefix, setPrefix] = useState(server.spec.prefix || "!");
  const [savedPrefix, setSavedPrefix] = useState(server.spec.prefix || "!");
  const [version, setVersion] = useState<number | null>(server.version ?? null);
  const [savingPrefix, setSavingPrefix] = useState(false);
  const prefixIdempotencyKey = useRef(crypto.randomUUID());
  const isInstalled = server.status.botInstalled;
  const botPermissions = Number(server.status.botPermissions || 0);
  const permissionsKnown = isInstalled && botPermissions > 0;
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&guild_id=${server.metadata.id}&disable_guild_select=true`;

  useEffect(() => {
    setPrefix(server.spec.prefix || "!");
    setSavedPrefix(server.spec.prefix || "!");
    setVersion(server.version ?? null);
  }, [server]);

  const copyServerId = () => {
    navigator.clipboard.writeText(server.metadata.id);
    setCopied(true);
    message.success("Server ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const savePrefix = async () => {
    const nextPrefix = prefix.trim();
    if (!nextPrefix || nextPrefix.length > 10) {
      message.error("Prefix must be between 1 and 10 characters.");
      return;
    }
    if (!version) {
      message.error("Could not reach Discord to verify server state. Please refresh the page and try again.");
      return;
    }
    setSavingPrefix(true);
    try {
      const result = await orpc.server.patchPrefix({
        serverId: server.metadata.id,
        prefix: nextPrefix,
        expectedVersion: version,
        idempotencyKey: prefixIdempotencyKey.current,
      });
      setPrefix(result.server?.spec.prefix || nextPrefix);
      setSavedPrefix(result.server?.spec.prefix || nextPrefix);
      setVersion(result.server?.version ?? null);
      prefixIdempotencyKey.current = crypto.randomUUID();
      onServerUpdated?.();
      message.success("Command prefix saved.");
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Unable to save the command prefix.");
    } finally {
      setSavingPrefix(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Info */}
      <div
        className="p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={dashboardGlassCardStyle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-lg">
            <SettingOutlined />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-['Sora']">
              Server Settings & Discord Permissions
            </h2>
            <p className="text-xs text-white/70">
              Essential bot settings and Discord permissions for {server.metadata.name}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyServerId}
          className="dashboard-btn-secondary px-3.5 py-2 min-h-[44px] text-xs self-start sm:self-auto inline-flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <CheckCircleOutlined className="text-emerald-400" /> : <CopyOutlined />}
          <span>Copy ID</span>
        </button>
      </div>

      {/* Grid of Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Command Prefix Card */}
        <div
          className="p-5 rounded-2xl border flex flex-col justify-between gap-4"
          style={dashboardGlassCardStyle}
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              Command Prefix
            </span>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <input
                aria-label="Command prefix"
                value={prefix}
                maxLength={10}
                disabled={!isInstalled || savingPrefix}
                onChange={(event) => setPrefix(event.target.value)}
                className="w-28 min-h-[44px] text-2xl font-black font-mono text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 outline-none transition-all"
              />
              <button
                type="button"
                onClick={savePrefix}
                disabled={!isInstalled || !version || savingPrefix || prefix.trim() === savedPrefix}
                className="dashboard-btn-primary px-4 py-2 min-h-[44px] text-xs font-semibold cursor-pointer"
              >
                {savingPrefix ? "Saving…" : "Save"}
              </button>
              <span className="text-xs text-white/70">
                (or slash commands <code>/</code>)
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              Choose the prefix used for text commands in this server.
            </p>
          </div>
        </div>

        {/* Integration Status Card */}
        <div
          className="p-5 rounded-2xl border flex flex-col justify-between gap-4"
          style={dashboardGlassCardStyle}
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              Bot Presence
            </span>
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircleOutlined /> Active in Server
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <ExclamationCircleOutlined /> Not in Server
                </span>
              )}
            </div>
            <p className="text-xs text-white/70 mt-1">
              Invite or re-authorize InterChat to refresh permissions and ensure all features function smoothly.
            </p>
          </div>

          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="dashboard-btn-secondary py-2.5 px-3.5 min-h-[44px] text-xs font-semibold text-center inline-flex items-center justify-center gap-1.5"
          >
            <LinkOutlined />
            <span>Re-authorize Bot</span>
          </a>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <ServerPermissionsGrid
        botPermissions={botPermissions}
        permissionsKnown={permissionsKnown}
      />
    </div>
  );
}
