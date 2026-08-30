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

interface ServerSettingsCardProps {
  server: ServerResource;
  botClientId?: string;
  onServerUpdated?: () => void;
}

const REQUIRED_PERMISSIONS = [
  { name: "Manage Webhooks", desc: "Required for cross-server message bridging and Userphone", bit: 1 << 29 },
  { name: "Manage Messages", desc: "Required for automod deletion and moderation panel commands", bit: 1 << 13 },
  { name: "View Channels", desc: "Required for bot responsiveness and command handling", bit: 1 << 10 },
  { name: "Send Messages", desc: "Required for bot responsiveness and command handling", bit: 1 << 11 },
  { name: "Embed Links & Attach Files", desc: "Required for rich card rendering and attachment relay", bit: (1 << 14) | (1 << 15) },
];

export function ServerSettingsCard({
  server,
  botClientId = "798748015435055134",
  onServerUpdated,
}: ServerSettingsCardProps) {
  const [copied, setCopied] = useState(false);
  const [prefix, setPrefix] = useState(server.spec.prefix || "!");
  const [savedPrefix, setSavedPrefix] = useState(server.spec.prefix || "!");
  const [version, setVersion] = useState(server.version ?? 1);
  const [savingPrefix, setSavingPrefix] = useState(false);
  const prefixIdempotencyKey = useRef(crypto.randomUUID());
  const isInstalled = server.status.botInstalled;
  const botPermissions = Number(server.status.botPermissions || 0);
  const permissionsKnown = isInstalled && botPermissions > 0;
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&guild_id=${server.metadata.id}&disable_guild_select=true`;

  useEffect(() => {
    setPrefix(server.spec.prefix || "!");
    setSavedPrefix(server.spec.prefix || "!");
    setVersion(server.version ?? 1);
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
      setVersion(result.server?.version ?? version + 1);
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
              Server Settings & Diagnostics
            </h2>
            <p className="text-xs text-white/60">
              Core bot integration parameters and permissions for {server.metadata.name}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyServerId}
          className="dashboard-btn-secondary px-3.5 py-1.5 text-xs self-start sm:self-auto flex items-center gap-1.5"
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
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
              Command Prefix
            </span>
            <div className="flex items-center gap-2">
              <input
                aria-label="Command prefix"
                value={prefix}
                maxLength={10}
                disabled={!isInstalled || savingPrefix}
                onChange={(event) => setPrefix(event.target.value)}
                className="w-28 text-2xl font-black font-mono text-white bg-white/5 border border-white/10 px-3 py-1 rounded-xl focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 outline-none transition-all"
              />
              <button
                type="button"
                onClick={savePrefix}
                disabled={!isInstalled || savingPrefix || prefix.trim() === savedPrefix}
                className="dashboard-btn-primary px-3.5 py-2 text-xs"
              >
                {savingPrefix ? "Saving…" : "Save"}
              </button>
              <span className="text-xs text-white/60">
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
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
              Bot Integration
            </span>
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircleOutlined /> Installed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <ExclamationCircleOutlined /> Not Installed
                </span>
              )}
            </div>
            <p className="text-xs text-white/70 mt-1">
              Re-authorize or grant updated Discord permissions to ensure smooth operation across all features.
            </p>
          </div>

          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="dashboard-btn-secondary py-2 px-3 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
          >
            <LinkOutlined />
            <span>Re-authorize Bot</span>
          </a>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div
        className="p-6 rounded-2xl border flex flex-col gap-4"
        style={dashboardGlassCardStyle}
      >
        <div>
          <h3 className="text-sm font-bold text-white font-['Sora']">
            Required Discord Permissions
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            Verified permissions for InterChat bot inside this Discord server
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REQUIRED_PERMISSIONS.map((perm) => {
            const hasPerm = permissionsKnown && (botPermissions & perm.bit) === perm.bit;
            const isMissing = permissionsKnown && !hasPerm;

            return (
              <div
                key={perm.name}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${hasPerm
                    ? "bg-emerald-500/[0.04] border-emerald-500/20"
                    : isMissing
                      ? "bg-amber-500/[0.04] border-amber-500/20"
                      : "bg-white/[0.03] border-white/[0.06]"
                  }`}
              >
                {hasPerm ? (
                  <CheckCircleOutlined className="text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : isMissing ? (
                  <ExclamationCircleOutlined className="text-amber-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <ExclamationCircleOutlined className="text-white/40 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-white">{perm.name}</span>
                  <span className="text-[11px] text-white/70">
                    {permissionsKnown
                      ? hasPerm
                        ? `Granted. ${perm.desc}`
                        : `Missing. ${perm.desc}`
                      : "Permission status not available."}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
