import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerBridgeResource, ServerResource } from "~/resources/server";
import { ServerOverviewPrefixEditor } from "./ServerOverviewPrefixEditor";
import { ServerOverviewQuickControls } from "./ServerOverviewQuickControls";
import { ServerOverviewTelemetry } from "./ServerOverviewTelemetry";

export interface ServerOverviewCardProps {
  server: ServerResource;
  botClientId?: string;
  bridges?: ServerBridgeResource[];
  bridgesCount?: number;
  blocksCount?: number;
  onServerUpdated?: () => void;
}

export function ServerOverviewCard({
  server,
  botClientId = "798748015435055134",
  bridges = [],
  bridgesCount,
  blocksCount,
  onServerUpdated,
}: ServerOverviewCardProps) {
  const isInstalled = server.status.botInstalled;
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&guild_id=${server.metadata.id}&disable_guild_select=true`;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Bot Installation Card - Always visible so uninstalled servers have actionable onboarding */}
      <section style={{ ...dashboardGlassCardStyle, padding: 24, borderRadius: 16 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                isInstalled
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
              }`}
            >
              {isInstalled ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-white">Bot Integration Status</h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isInstalled
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                      : "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                  }`}
                >
                  {isInstalled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  {isInstalled ? "Installed" : "Action Required"}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/70">
                {isInstalled
                  ? "InterChat bot is installed. Operational health and routing telemetry are synced below."
                  : "InterChat needs to be invited to this Discord server before cross-server Hubs and Calls can function."}
              </p>
            </div>
          </div>
          {!isInstalled && (
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="dashboard-btn-primary px-5 py-2.5 min-h-[44px] text-xs font-bold flex-shrink-0 inline-flex items-center gap-2"
            >
              <PlusOutlined />
              <span>Add Bot to Discord</span>
            </a>
          )}
        </div>
      </section>

      {/* Mission Control: In-Place Core Operations */}
      <section style={{ ...dashboardGlassCardStyle, padding: 24, borderRadius: 16 }}>
        <div className="border-b border-white/[0.08] pb-4 mb-5">
          <h2 className="text-base font-bold text-white">Mission Control</h2>
          <p className="text-xs text-white/70 mt-0.5">
            Core server configurations that take effect immediately in your Discord guild.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ServerOverviewPrefixEditor server={server} onServerUpdated={onServerUpdated} />
          <ServerOverviewQuickControls server={server} onServerUpdated={onServerUpdated} />
        </div>
      </section>

      {/* Operational Telemetry & Live Health */}
      <section style={{ ...dashboardGlassCardStyle, padding: 24, borderRadius: 16 }}>
        <div className="border-b border-white/[0.08] pb-4 mb-5">
          <h2 className="text-base font-bold text-white">Live Routing & Telemetry</h2>
          <p className="text-xs text-white/70 mt-0.5">
            Real-time status of message bridges, call availability, and safety filters.
          </p>
        </div>

        <ServerOverviewTelemetry
          server={server}
          bridges={bridges}
          bridgesCount={bridgesCount}
          blocksCount={blocksCount}
        />
      </section>
    </div>
  );
}
