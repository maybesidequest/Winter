import { ExclamationCircleOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { CreateHubWizard } from "~/components/CreateHubWizard";
import { HubListItem } from "~/components/dashboard/HubListItem";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { orpc } from "~/lib/orpc";
import {
  HUB_CREATION_UNAVAILABLE_MESSAGE,
  canCreateHub,
} from "~/services/hubCreationAvailability";

export default function HubsPage() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hubCreationEnabled = canCreateHub(capabilities);
  const { data: hubs = [], isLoading, isError } = useQuery({
    ...orpc.hub.getUserHubs.queryOptions({ staleTime: 60_000 }),
    enabled: capabilities.HUB_LIST || import.meta.env.DEV,
  });
  if (!capabilities.HUB_LIST && !import.meta.env.DEV) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        <PageHeader
          eyebrow="Places"
          title="Hubs"
          description="Persistent spaces where connected Discord communities share conversation, rules, and a moderation team."
        />
        <div
          className="p-10 rounded-2xl border flex flex-col items-center justify-center text-center gap-4"
          style={dashboardGlassCardStyle}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl">
            <TeamOutlined />
          </div>
          <div className="flex flex-col gap-1.5 max-w-md">
            <h3 className="text-base font-bold text-white font-['Sora'] m-0">
              Hub Management Restricted
            </h3>
            <p className="text-xs text-white/60 m-0">
              Personal Hub management is currently restricted or undergoing rollout in this environment. If you believe this is an error, please verify that the Hub capability flag is enabled.
            </p>
          </div>
          <Link to="/dashboard" className="dashboard-btn-secondary px-5 py-2 text-xs font-bold mt-2">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
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
        actions={hubCreationEnabled ? (
          <button
            className="dashboard-btn-primary px-4 py-2 text-xs font-bold"
            type="button"
            onClick={() => setCreateOpen(true)}
          >
            <PlusOutlined />
            <span>Create Hub</span>
          </button>
        ) : undefined}
      />

      {isError && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm flex items-center gap-3">
          <ExclamationCircleOutlined className="text-red-400 text-base flex-shrink-0" />
          <span>Your Hub access could not be verified. No permissions have been changed.</span>
        </div>
      )}

      {!hubCreationEnabled && (
        <div
          className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-100 text-sm"
          role="status"
        >
          {HUB_CREATION_UNAVAILABLE_MESSAGE}
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
              placeholder="Search your Hubs by name or description..."
              className="dashboard-input text-sm w-full sm:max-w-sm min-h-[42px]"
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
              <HubListItem key={hub.metadata.id} hub={hub} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#181726] border border-white/10 flex items-center justify-center text-xl text-violet-300 shadow-[0_2px_0_0_rgba(10,8,23,0.5)]">
              <TeamOutlined />
            </div>
            <h3 className="text-base font-bold text-white font-['Sora'] m-0">
              {hubs.length > 0 ? "No matching Hubs" : "No accessible Hubs"}
            </h3>
            <p className="text-xs text-white/50 max-w-sm m-0">
              {hubs.length > 0 ? "No hubs match your search criteria. Try a different query." : "Ask a Hub owner to add you to their team, or create your first Hub."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="dashboard-btn-secondary px-3.5 py-1.5 text-xs font-bold mt-1"
              >
                Clear Search
              </button>
            )}
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
