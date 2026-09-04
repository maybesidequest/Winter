import {
  CompassOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { SUPPORT_SERVER_URL } from "~/components/marketing/constants";
import { orpc } from "~/lib/orpc";

interface QuickActionRailProps {
  capabilities?: Record<string, boolean>;
}

export function QuickActionRail({ capabilities = {} }: QuickActionRailProps) {
  const moderationEnabled = Boolean(capabilities.MODERATION || import.meta.env.DEV);

  const { data: infractions = [] } = useQuery({
    ...orpc.moderation.listMyAppealableInfractions.queryOptions(),
    enabled: moderationEnabled,
  });

  const appealableCount = infractions.length;

  return (
    <nav
      aria-label="Dashboard quick actions"
      className="flex items-center gap-2.5 flex-wrap p-2 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
    >
      <Link
        to="/dashboard/servers"
        className="dashboard-btn-primary !min-h-[38px] !px-4 !py-2 !text-xs !font-bold flex items-center gap-2"
      >
        <LinkOutlined className="text-sm" />
        <span>Link a Channel</span>
      </Link>

      <Link
        to="/dashboard/browse"
        className="dashboard-btn-secondary !min-h-[38px] !px-4 !py-2 !text-xs !font-bold flex items-center gap-2"
      >
        <CompassOutlined className="text-sm" />
        <span>Explore Hubs</span>
      </Link>

      {moderationEnabled && (
        <Link
          to="/dashboard/appeals"
          className="dashboard-btn-secondary !min-h-[38px] !px-4 !py-2 !text-xs !font-bold flex items-center gap-2"
        >
          <SafetyCertificateOutlined className="text-sm" />
          <span>Appeals</span>
          {appealableCount > 0 && (
            <span
              className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-extrabold bg-[#ff8c73]/20 text-[#ff8c73] border border-[#ff8c73]/30"
              title={`${appealableCount} active appealable infraction(s)`}
            >
              {appealableCount}
            </span>
          )}
        </Link>
      )}

      <a
        href={SUPPORT_SERVER_URL}
        target="_blank"
        rel="noreferrer"
        className="dashboard-btn-secondary !min-h-[38px] !px-4 !py-2 !text-xs !font-bold flex items-center gap-2 ml-auto"
      >
        <QuestionCircleOutlined className="text-sm" />
        <span>Support</span>
      </a>
    </nav>
  );
}

