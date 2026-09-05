import {
  BarChartOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  CompassOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { HubResource } from "~/resources/hub";
import type { ServerResource } from "~/resources/server";
import { SidebarNavGroup, SidebarNavLink } from "./SidebarNavGroup";

interface GeneralSidebarTabsProps {
  servers?: ServerResource[];
  hubs?: HubResource[];
  isLoading?: boolean;
  onNavigate?: () => void;
  capabilities?: Record<string, boolean>;
}

export function GeneralSidebarTabs({
  servers = [],
  hubs = [],
  isLoading = false,
  onNavigate,
  capabilities,
}: GeneralSidebarTabsProps) {
  const enabled = (capability: string) => capabilities?.[capability] ?? import.meta.env.DEV;

  return (
    <div className="flex flex-col gap-2.5 py-1">
      <nav aria-label="General navigation" className="flex flex-col gap-0.5">
        <SidebarNavLink to="/dashboard" end label="Home" icon={<HomeOutlined />} onClick={onNavigate} />
        {enabled("USER_ACTIVITY") && (
          <SidebarNavLink to="/dashboard/activity" label="Your activity" icon={<BarChartOutlined />} onClick={onNavigate} />
        )}
        {enabled("USER_HELP") && (
          <SidebarNavLink to="/dashboard/help" label="Help & resources" icon={<QuestionCircleOutlined />} onClick={onNavigate} />
        )}
        {enabled("MODERATION") && (
          <SidebarNavLink to="/dashboard/appeals" label="Appeals" icon={<SafetyCertificateOutlined />} onClick={onNavigate} />
        )}
      </nav>

      {/* Community & Hubs */}
      <SidebarNavGroup id="community" title="Community & Hubs" colorClass="text-purple-300/70">
        {enabled("HUB_DISCOVERY") && (
          <SidebarNavLink to="/dashboard/browse" label="Explore Directory" icon={<CompassOutlined />} onClick={onNavigate} />
        )}
        {enabled("HUB_LIST") && (
          <SidebarNavLink to="/dashboard/hubs" end label="All Hubs" icon={<ClusterOutlined />} onClick={onNavigate} />
        )}

        {isLoading ? (
          <div className="flex flex-col gap-1.5 px-3.5 py-1 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-1.5 rounded-lg bg-white/[0.02]">
                <div className="w-5 h-5 rounded-md bg-white/[0.08]" />
                <div className="h-3 rounded bg-white/[0.08] flex-1 max-w-[120px]" />
              </div>
            ))}
          </div>
        ) : enabled("HUB_LIST") ? (
          hubs.slice(0, 3).map((h) => (
            <SidebarNavLink
              key={h.metadata.id}
              to={`/dashboard/hubs/${h.metadata.id}/overview`}
              label={h.metadata.name}
              icon={
                <div className="w-5 h-5 rounded-md overflow-hidden bg-violet-950/60 border border-violet-400/20 flex items-center justify-center text-xs font-bold text-violet-300 group-hover:text-violet-200 group-hover:border-violet-400/40 transition-colors duration-150 flex-shrink-0">
                  {h.spec.iconUrl ? (
                    <img src={h.spec.iconUrl} alt={h.metadata.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{h.metadata.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
              }
              onClick={onNavigate}
            />
          ))
        ) : null}
      </SidebarNavGroup>

      {/* Discord Servers */}
      <SidebarNavGroup id="servers" title="Discord Servers" colorClass="text-sky-300/70">
        <SidebarNavLink to="/dashboard/servers" end label="All Servers" icon={<CloudServerOutlined />} onClick={onNavigate} />

        {isLoading ? (
          <div className="flex flex-col gap-1.5 px-3.5 py-1 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-1.5 rounded-lg bg-white/[0.02]">
                <div className="w-5 h-5 rounded-md bg-white/[0.08]" />
                <div className="h-3 rounded bg-white/[0.08] flex-1 max-w-[120px]" />
              </div>
            ))}
          </div>
        ) : (
          servers.slice(0, 4).map((s) => (
            <SidebarNavLink
              key={s.metadata.id}
              to={`/dashboard/servers/${s.metadata.id}/overview`}
              label={s.metadata.name}
              icon={
                <div className="w-5 h-5 rounded-md overflow-hidden bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:bg-white/20 transition-colors duration-150">
                  {s.metadata.iconUrl ? (
                    <img src={s.metadata.iconUrl} alt={s.metadata.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{s.metadata.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
              }
              onClick={onNavigate}
            />
          ))
        )}
      </SidebarNavGroup>
    </div>
  );
}
