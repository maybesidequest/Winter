import { LinkOutlined } from "@ant-design/icons";
import { Link, useOutletContext } from "react-router";
import { PageHeader } from "./PageHeader";
import { ChatActivityCard } from "./home/ChatActivityCard";
import { ConnectionStatusCard } from "./home/ConnectionStatusCard";
import { GettingStartedCard } from "./home/GettingStartedCard";
import { QuickActionRail } from "./home/QuickActionRail";
import type { HubResource } from "~/resources/hub";
import type { ServerResource } from "~/resources/server";

type DashboardUser = {
  id: string;
  username: string;
  globalName?: string | null;
  avatar?: string | null;
};

type DashboardContext = {
  user?: DashboardUser;
  servers?: ServerResource[];
  hubs?: HubResource[];
  capabilities?: Record<string, boolean>;
  isLoading?: boolean;
};

export function DashboardHome() {
  const context = useOutletContext<DashboardContext>();
  const user = context?.user;
  const servers = context?.servers ?? [];
  const hubs = context?.hubs ?? [];
  const capabilities = context?.capabilities ?? {};

  const username = user?.globalName || user?.username;
  const greeting = username ? `Hey, ${username}` : "Hey there";

  const totalConnections = hubs.reduce(
    (sum, hub) => sum + (hub.status?.connectionCount || 0),
    0
  );

  const isBrandNew = servers.length === 0 && hubs.length === 0;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Overview"
        title={greeting}
        description="Here's what's happening across your connected Discord servers and hubs."
        actions={
          <Link
            to="/dashboard/servers"
            className="dashboard-btn-primary !min-h-[34px] !px-3.5 !py-1.5 !text-xs !font-bold flex items-center gap-1.5"
          >
            <LinkOutlined className="text-xs" />
            <span>Link Channel</span>
          </Link>
        }
      />

      <QuickActionRail capabilities={capabilities} />

      <ConnectionStatusCard hubs={hubs} servers={servers} />

      {isBrandNew || totalConnections === 0 ? (
        <GettingStartedCard
          hasServers={servers.length > 0}
          hasHubs={hubs.length > 0}
          hasConnections={totalConnections > 0}
        />
      ) : null}

      <ChatActivityCard capabilities={capabilities} />
    </div>
  );
}
