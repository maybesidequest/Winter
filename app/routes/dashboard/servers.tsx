import {
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { orpc } from "~/lib/orpc";

export default function ServersPage() {
  const queryClient = useQueryClient();
  const { data: servers, isLoading, isError } = useQuery(
    orpc.server.list.queryOptions({ staleTime: 30_000 })
  );
  const serverItems = servers ?? [];
  const [cooldown, setCooldown] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleRefresh = async () => {
    if (cooldown > 0 || isRefreshing) return;
    setIsRefreshing(true);
    setCooldown(5);
    try {
      const fresh = await queryClient.fetchQuery(
        orpc.server.list.queryOptions({ input: { forceRefresh: true } })
      );
      queryClient.setQueryData(orpc.server.list.queryOptions().queryKey, fresh);
      message.success("Server list refreshed from Discord.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to refresh servers from Discord.";
      message.error(msg);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Places"
        title="Discord servers"
        description="Manage InterChat text Call behavior for servers where you have Discord Manage Server permission."
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={cooldown > 0 || isRefreshing}
            className="dashboard-btn-secondary flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ReloadOutlined className={isRefreshing ? "animate-spin text-purple-400" : "text-white/70"} />
            <span>
              {isRefreshing
                ? "Refreshing..."
                : cooldown > 0
                  ? `Refresh in ${cooldown}s`
                  : "Refresh servers"}
            </span>
          </button>
        }
      />

      <div
        className="rounded-2xl border overflow-hidden flex flex-col"
        style={dashboardGlassCardStyle}
      >
        {isLoading ? (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08]" />
                  <div className="flex flex-col gap-1.5">
                    <div className="w-36 h-4 rounded bg-white/[0.08]" />
                    <div className="w-24 h-3 rounded bg-white/[0.05]" />
                  </div>
                </div>
                <div className="w-20 h-4 rounded bg-white/[0.06] hidden sm:block" />
                <div className="w-16 h-7 rounded-lg bg-white/[0.06]" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3" role="alert">
            <ExclamationCircleOutlined className="text-red-400 text-2xl" />
            <h3 className="text-base font-bold text-white font-['Sora']">Server data unavailable</h3>
            <p className="text-xs text-white/60 max-w-sm">Discord or the Control Plane could not return your server inventory. Retry when the service is available.</p>
          </div>
        ) : serverItems.length > 0 ? (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {serverItems.map((server) => {
              const isInstalled = server.status.botInstalled;
              return (
                <div
                  key={server.metadata.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Identity */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-sky-900/40 border border-sky-400/20 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-['Sora'] shadow-sm">
                      {server.metadata.iconUrl ? (
                        <img
                          src={server.metadata.iconUrl}
                          alt={server.metadata.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{server.metadata.name.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white truncate font-['Sora']">
                        {server.metadata.name}
                      </div>
                      <div className="text-xs text-white/50">
                        {isInstalled ? "InterChat installed" : "InterChat not installed"}
                      </div>
                    </div>
                  </div>

                  {/* Meta Details */}
                  <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 text-xs">
                    <div className="text-white/60 hidden md:block">
                      <span className="font-semibold text-white/90">
                        {server.spec.lobbyChannelIds.length || "Any"}
                      </span> allowed channels
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${isInstalled
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isInstalled ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-amber-400"
                            }`}
                        />
                        {isInstalled ? "Installed" : "Install required"}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/dashboard/servers/${server.metadata.id}/overview`}
                      className="dashboard-btn-secondary px-4 py-1.5 text-xs font-bold"
                    >
                      <span>Manage</span>
                      <ArrowRightOutlined className="text-xs" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white/40">
              <SafetyCertificateOutlined />
            </div>
            <h3 className="text-base font-bold text-white font-['Sora']">No manageable servers</h3>
            <p className="text-xs text-white/50 max-w-sm">
              Discord did not return any servers where you have Manage Server permission.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
