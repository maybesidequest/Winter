import { PlusOutlined, TeamOutlined, ArrowRightOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useOutletContext } from "react-router";
import { orpc } from "~/lib/orpc";
import { CreateHubWizard } from "~/components/CreateHubWizard";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

export default function HubsPage() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: hubs = [], isLoading, isError } = useQuery({
    ...orpc.hub.getUserHubs.queryOptions(),
    enabled: capabilities.HUB_LIST || import.meta.env.DEV,
  });
  if (!capabilities.HUB_LIST && !import.meta.env.DEV) return <Navigate to="/dashboard" replace />;
  const filteredHubs = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return hubs;
    return hubs.filter((hub) =>
      [hub.metadata.name, hub.spec.shortDescription, hub.spec.description]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase().includes(query)),
    );
  }, [hubs, search]);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Places"
        title="Hubs"
        description="Persistent spaces where connected Discord communities share conversation, rules, and a moderation team."
        actions={(
          <button
            className="dashboard-btn-primary px-4 py-2 text-xs font-bold"
            type="button"
            onClick={() => setCreateOpen(true)}
          >
            <PlusOutlined />
            <span>Create Hub</span>
          </button>
        )}
      />

      {isError && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm flex items-center gap-3">
          <ExclamationCircleOutlined className="text-red-400 text-base flex-shrink-0" />
          <span>Your Hub access could not be verified. No permissions have been changed.</span>
        </div>
      )}

      <div
        className="rounded-2xl border overflow-hidden flex flex-col"
        style={dashboardGlassCardStyle}
      >
        {!isLoading && hubs.length > 0 && (
          <div className="p-4 border-b border-white/[0.06]">
            <label htmlFor="hub-search" className="sr-only">Search your Hubs</label>
            <input
              id="hub-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your Hubs"
              className="dashboard-input text-xs w-full sm:max-w-sm"
            />
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {[1, 2, 3].map((i) => (
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
        ) : filteredHubs.length > 0 ? (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {filteredHubs.map((hub) => (
              <div
                key={hub.metadata.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Identity */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-violet-950/60 border border-violet-400/20 flex items-center justify-center text-xs font-bold text-violet-300 flex-shrink-0 font-['Sora'] shadow-sm">
                    {hub.spec.iconUrl ? (
                      <img
                        src={hub.spec.iconUrl}
                        alt={hub.metadata.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{hub.metadata.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate font-['Sora']">
                      {hub.metadata.name}
                    </div>
                    <div className="text-xs text-white/50 truncate max-w-md">
                      {hub.spec.shortDescription || hub.spec.description || "No description provided."}
                    </div>
                  </div>
                </div>

                {/* Meta Details */}
                <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 text-xs">
                  <div className="text-white/60 hidden md:block">
                    <span className="font-semibold text-white/90">{hub.status.connectionCount}</span> routes
                    <span className="mx-1.5 text-white/20">·</span>
                    <span className="font-semibold text-white/90">
                      {hub.status.weeklyMessageCount}
                    </span> messages this week
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        hub.spec.locked
                          ? "bg-red-500/15 text-red-300 border-red-500/30"
                          : "bg-violet-500/15 text-violet-300 border-violet-500/30"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          hub.spec.locked ? "bg-red-400" : "bg-violet-400"
                        }`}
                      />
                      {hub.spec.locked ? "Locked" : hub.spec.visibility}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/dashboard/hubs/${hub.metadata.id}/overview`}
                    className="dashboard-btn-secondary px-4 py-1.5 text-xs font-bold"
                  >
                    <span>Manage</span>
                    <ArrowRightOutlined className="text-[10px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white/40">
              <TeamOutlined />
            </div>
            <h3 className="text-base font-bold text-white font-['Sora']">
              {hubs.length > 0 ? "No matching Hubs" : "No accessible Hubs"}
            </h3>
            <p className="text-xs text-white/50 max-w-sm">
              {hubs.length > 0 ? "Try a different search term." : "Ask a Hub owner to add you to their team."}
            </p>
          </div>
        )}
      </div>

      <CreateHubWizard
        mode="modal"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        isFirstHub={hubs.length === 0}
        onCreated={async (hubId) => {
          await queryClient.invalidateQueries({
            queryKey: orpc.hub.getUserHubs.queryOptions().queryKey,
          });
          navigate(`/dashboard/hubs/${hubId}/overview`);
        }}
      />
    </div>
  );
}
