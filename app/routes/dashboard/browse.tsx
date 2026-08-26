import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CompassOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { orpc } from "~/lib/orpc";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { HubDiscoveryHero } from "~/components/discovery/HubDiscoveryHero";
import { HubSearchBar } from "~/components/discovery/HubSearchBar";
import { HubTagPills } from "~/components/discovery/HubTagPills";
import { HubCard } from "~/components/discovery/HubCard";
import { HubCardSkeleton } from "~/components/discovery/HubCardSkeleton";
import { HubConnectModal } from "~/components/discovery/HubConnectModal";
import { HubDetailsDrawer } from "~/components/discovery/HubDetailsDrawer";
import type { HubPublicResource } from "~/resources/hubDiscovery";
import type { HubDiscoverySort } from "~/schemas/hubDiscovery";
import type { HubResource } from "~/resources/hub";

function mergeHubDetails(summary: HubPublicResource, detail: HubResource): HubPublicResource {
  // Search results are intentionally a small public projection.  When a user
  // opens the drawer, replace it with the authoritative Hub resource so rules,
  // branding, and counters are not fabricated or left stale.
  return {
    ...summary,
    metadata: {
      ...summary.metadata,
      name: detail.metadata.name,
      createdAt: detail.metadata.createdAt,
      updatedAt: detail.metadata.updatedAt,
    },
    spec: {
      ...summary.spec,
      description: detail.spec.description,
      shortDescription: detail.spec.shortDescription,
      visibility: detail.spec.visibility,
      language: detail.spec.language,
      region: detail.spec.region,
      iconUrl: detail.spec.iconUrl,
      bannerUrl: detail.spec.bannerUrl,
      nsfw: detail.spec.nsfw,
      rules: detail.spec.rules,
    },
    status: {
      ...summary.status,
      verified: detail.status.verified,
      partnered: detail.status.partnered,
      featured: detail.status.featured,
      connectionCount: detail.status.connectionCount,
      weeklyMessageCount: detail.status.weeklyMessageCount,
      averageRating: detail.status.averageRating,
      reviewCount: detail.status.reviewCount,
      upvoteCount: detail.status.upvoteCount,
    },
  };
}

export async function loader() {
  return null;
}

export default function BrowseRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State modals
  const [connectingHub, setConnectingHub] = useState<HubPublicResource | null>(null);
  const [inspectingHub, setInspectingHub] = useState<HubPublicResource | null>(null);

  // Parse URL search parameters
  const search = searchParams.get("q") || "";
  const sort = (searchParams.get("sort") as HubDiscoverySort) || "trending";
  const tagsParam = searchParams.get("tags");
  const selectedTags = useMemo(() => (tagsParam ? tagsParam.split(",").filter(Boolean) : []), [tagsParam]);
  const nsfw = searchParams.get("nsfw") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Update URL helper
  const updateParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === "" || val === "false") {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  // Queries
  const { data: searchResult, isLoading, isError } = useQuery(
    orpc.hubDiscovery.search.queryOptions({
      input: {
        search: search || undefined,
        sort,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        nsfw,
        page,
        limit: 18,
      },
    })
  );

  const { data: featuredHubs = [] } = useQuery(
    orpc.hubDiscovery.getFeatured.queryOptions()
  );

  const { data: popularTags = [] } = useQuery(
    orpc.hubDiscovery.getPopularTags.queryOptions()
  );

  const { data: inspectedHubDetail } = useQuery({
    ...orpc.hub.getHub.queryOptions({ input: { hubId: inspectingHub?.metadata.id || "" } }),
    enabled: inspectingHub !== null,
  });

  const inspectedHub = inspectingHub && inspectedHubDetail
    ? mergeHubDetails(inspectingHub, inspectedHubDetail)
    : inspectingHub;

  const hubs = searchResult?.items || [];
  const pagination = searchResult?.pagination;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-12">
      <PageHeader
        eyebrow="Network Directory"
        title="Explore Hubs"
        description="Discover public InterChat bridges, explore active topic networks, or connect a hub directly to your Discord server."
      />

      {/* Featured Hero Spotlight (shown when not filtering by search) */}
      {!search && selectedTags.length === 0 && featuredHubs.length > 0 && (
        <HubDiscoveryHero
          featuredHubs={featuredHubs}
          onConnect={(hub) => setConnectingHub(hub)}
          onInspect={(hub) => setInspectingHub(hub)}
        />
      )}

      {/* Search & Sort Controls */}
      <div className="flex flex-col gap-3.5">
        <HubSearchBar
          search={search}
          sort={sort}
          nsfw={nsfw}
          onSearchChange={(q) => updateParams({ q, page: "1" })}
          onSortChange={(s) => updateParams({ sort: s, page: "1" })}
          onNsfwChange={(n) => updateParams({ nsfw: n ? "true" : undefined, page: "1" })}
        />

        <HubTagPills
          tags={popularTags}
          selectedTags={selectedTags}
          onToggleTag={(tagName) => {
            const nextTags = selectedTags.includes(tagName)
              ? selectedTags.filter((t) => t !== tagName)
              : [...selectedTags, tagName];
            updateParams({ tags: nextTags.length > 0 ? nextTags.join(",") : undefined, page: "1" });
          }}
          onClearTags={() => updateParams({ tags: undefined, page: "1" })}
        />
      </div>

      {/* Hub Cards Grid */}
      {isLoading ? (
        <HubCardSkeleton count={6} />
      ) : isError ? (
        <div className="p-8 text-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs">
          Failed to load public hubs. Please try refreshing the page.
        </div>
      ) : hubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hubs.map((hub) => (
            <HubCard
              key={hub.metadata.id}
              hub={hub}
              onConnect={(h) => setConnectingHub(h)}
              onInspect={(h) => setInspectingHub(h)}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white/40">
            <CompassOutlined />
          </div>
          <h3 className="text-base font-bold text-white font-['Sora']">No Hubs Found</h3>
          <p className="text-xs text-white/50 max-w-sm">
            No public hubs match your current search and filters. Try clearing tags or searching for a different keyword.
          </p>
        </div>
      )}

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) })}
            className="dashboard-btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <LeftOutlined className="text-[10px]" />
            <span>Previous</span>
          </button>
          <span className="text-xs text-white/60 font-medium">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => updateParams({ page: String(page + 1) })}
            className="dashboard-btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <RightOutlined className="text-[10px]" />
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <HubConnectModal
        hub={connectingHub}
        open={!!connectingHub}
        onCancel={() => setConnectingHub(null)}
      />

      <HubDetailsDrawer
        hub={inspectedHub}
        open={!!inspectingHub}
        onClose={() => setInspectingHub(null)}
        onConnect={(h) => {
          setInspectingHub(null);
          setConnectingHub(h);
        }}
      />
    </div>
  );
}
