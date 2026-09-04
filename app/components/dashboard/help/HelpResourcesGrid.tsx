import {
  ArrowRightOutlined,
  CompassOutlined,
  ExportOutlined,
  LikeOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { ADD_INTERCHAT_URL, SUPPORT_SERVER_URL } from "~/components/marketing/constants";

interface HelpResourceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
  external?: boolean;
  icon: React.ReactNode;
}

const RESOURCES: HelpResourceItem[] = [
  {
    id: "support",
    title: "Support Server",
    description: "Join our official Discord server to get help or report bugs directly to our team.",
    href: SUPPORT_SERVER_URL,
    label: "Join Support",
    external: true,
    icon: <QuestionCircleOutlined className="text-violet-300 text-lg" />,
  },
  {
    id: "invite",
    title: "Invite InterChat",
    description: "Add the bot to another Discord community where you have Manage Server rights.",
    href: ADD_INTERCHAT_URL,
    label: "Add to Discord",
    external: true,
    icon: <RobotOutlined className="text-[#8fd3ff] text-lg" />,
  },
  {
    id: "vote",
    title: "Vote on Top.gg",
    description: "Support InterChat on Top.gg to help new communities discover the network.",
    href: "https://top.gg/bot/interchat/vote",
    label: "Vote on Top.gg",
    external: true,
    icon: <LikeOutlined className="text-[#ff8c73] text-lg" />,
  },
  {
    id: "rules",
    title: "Browse Hubs",
    description: "Explore the public directory to find new Hubs and review their community guidelines.",
    href: "/dashboard/browse",
    label: "Open Directory",
    external: false,
    icon: <CompassOutlined className="text-emerald-300 text-lg" />,
  },
];

export function HelpResourcesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {RESOURCES.map((resource) => (
        <div
          key={resource.id}
          className="rounded-2xl p-5 border flex flex-col justify-between gap-4 transition-all hover:border-white/[0.14] group"
          style={dashboardGlassCardStyle}
        >
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
              {resource.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Sora'] m-0">
                {resource.title}
              </h3>
              <p className="text-xs text-white/65 m-0 mt-1 leading-relaxed">
                {resource.description}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06]">
            {resource.external ? (
              <a
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-violet-300 hover:text-violet-200 transition-colors inline-flex items-center gap-1.5"
              >
                <span>{resource.label}</span>
                <ExportOutlined className="text-xs" />
              </a>
            ) : (
              <Link
                to={resource.href}
                className="text-xs font-bold text-violet-300 hover:text-violet-200 transition-colors inline-flex items-center gap-1.5"
              >
                <span>{resource.label}</span>
                <ArrowRightOutlined className="text-xs group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

