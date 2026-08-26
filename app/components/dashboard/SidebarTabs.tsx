import type { ServerResource } from "~/resources/server";
import type { HubResource } from "~/resources/hub";
import { HubSidebarTabs } from "./tabs/HubSidebarTabs";
import { ServerSidebarTabs } from "./tabs/ServerSidebarTabs";
import { GeneralSidebarTabs } from "./tabs/GeneralSidebarTabs";

export type SidebarContext =
  | { type: "dashboard" }
  | { type: "hub"; id: string; hub?: HubResource }
  | { type: "server"; id: string; server?: ServerResource }
  | { type: "browse" };

interface SidebarTabsProps {
  context: SidebarContext;
  servers?: ServerResource[];
  hubs?: HubResource[];
  isLoading?: boolean;
  onNavigate?: () => void;
  capabilities?: Record<string, boolean>;
}

export function SidebarTabs({
  context,
  servers = [],
  hubs = [],
  isLoading = false,
  onNavigate,
  capabilities,
}: SidebarTabsProps) {
  if (context.type === "hub") {
    return <HubSidebarTabs hubId={context.id} hub={context.hub} onNavigate={onNavigate} capabilities={capabilities} />;
  }

  if (context.type === "server") {
    return <ServerSidebarTabs serverId={context.id} server={context.server} onNavigate={onNavigate} capabilities={capabilities} />;
  }

  return (
    <GeneralSidebarTabs
      servers={servers}
      hubs={hubs}
      isLoading={isLoading}
      onNavigate={onNavigate}
      capabilities={capabilities}
    />
  );
}
