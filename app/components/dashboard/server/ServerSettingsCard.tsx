import { useState } from "react";
import {
  SettingOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerResource } from "~/resources/server";

interface ServerSettingsCardProps {
  server: ServerResource;
  botClientId?: string;
}

const REQUIRED_PERMISSIONS = [
  { name: "Manage Webhooks", desc: "Required for cross-server message bridging and Userphone" },
  { name: "Manage Messages", desc: "Required for automod deletion and moderation panel commands" },
  { name: "View Channels & Send Messages", desc: "Required for bot responsiveness and command handling" },
  { name: "Embed Links & Attach Files", desc: "Required for rich card rendering and attachment relay" },
];

export function ServerSettingsCard({
  server,
  botClientId = "904791550993072230",
}: ServerSettingsCardProps) {
  const [copied, setCopied] = useState(false);
  const isInstalled = server.status.botInstalled;
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=534723950656&scope=bot%20applications.commands&guild_id=${server.metadata.id}&disable_guild_select=true`;

  const copyServerId = () => {
    navigator.clipboard.writeText(server.metadata.id);
    setCopied(true);
    message.success("Server ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
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
              <span className="text-2xl font-black font-mono text-white bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
                {server.spec.prefix || "!"}
              </span>
              <span className="text-xs text-white/50">
                (or slash commands <code>/</code>)
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Prefix commands can be customized in Discord using the <code>/prefix &lt;new_prefix&gt;</code> command.
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
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <CheckCircleOutlined /> Active & Installed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <ExclamationCircleOutlined /> Not Installed
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 mt-1">
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
        <h3 className="text-sm font-bold text-white font-['Sora']">
          Required Discord Permissions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REQUIRED_PERMISSIONS.map((perm) => (
            <div
              key={perm.name}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3"
            >
              <CheckCircleOutlined className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-white">{perm.name}</span>
                <span className="text-[11px] text-white/50">{perm.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

