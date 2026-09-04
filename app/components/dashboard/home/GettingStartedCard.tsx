import {
  CheckOutlined,
  CompassOutlined,
  LinkOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import { ADD_INTERCHAT_URL } from "~/components/marketing/constants";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

interface GettingStartedCardProps {
  hasServers: boolean;
  hasHubs: boolean;
  hasConnections: boolean;
}

export function GettingStartedCard({
  hasServers,
  hasHubs,
  hasConnections,
}: GettingStartedCardProps) {
  const steps = [
    {
      id: 1,
      title: "Add InterChat to your Discord server",
      description:
        "Invite the bot to a server where you have Administrator or Manage Server permissions.",
      done: hasServers,
      action: (
        <a
          href={ADD_INTERCHAT_URL}
          target="_blank"
          rel="noreferrer"
          className="dashboard-btn-secondary !min-h-[32px] !px-3 !py-1 !text-xs !font-bold flex items-center gap-1.5"
        >
          <RobotOutlined className="text-xs" />
          <span>Invite Bot ↗</span>
        </a>
      ),
    },
    {
      id: 2,
      title: "Join or create a Hub",
      description:
        "Pick a public Hub to chat with other communities, or create your own network.",
      done: hasHubs,
      action: (
        <Link
          to="/dashboard/browse"
          className="dashboard-btn-secondary !min-h-[32px] !px-3 !py-1 !text-xs !font-bold flex items-center gap-1.5"
        >
          <CompassOutlined className="text-xs" />
          <span>Explore Hubs</span>
        </Link>
      ),
    },
    {
      id: 3,
      title: "Link a text channel",
      description:
        "Pick a channel in your server so messages start flowing across the Hub network.",
      done: hasConnections,
      action: (
        <Link
          to="/dashboard/servers"
          className="dashboard-btn-primary !min-h-[32px] !px-3 !py-1 !text-xs !font-bold flex items-center gap-1.5"
        >
          <LinkOutlined className="text-xs" />
          <span>Link Channel</span>
        </Link>
      ),
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;

  return (
    <div
      className="rounded-2xl p-6 border flex flex-col gap-5"
      style={dashboardGlassCardStyle}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">
            Getting Started with InterChat
          </h3>
          <p className="text-xs text-white/65 m-0 mt-0.5">
            Follow these three quick steps to link your community.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
          {completedCount} of 3 completed
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              step.done
                ? "bg-white/[0.02] border-white/[0.06] opacity-75"
                : "bg-white/[0.04] border-white/[0.1] hover:border-violet-500/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                  step.done
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                }`}
              >
                {step.done ? <CheckOutlined className="text-xs" /> : step.id}
              </div>

              <div>
                <h4
                  className={`text-sm font-bold m-0 ${
                    step.done ? "text-white/70 line-through" : "text-white"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-white/65 m-0 mt-0.5">{step.description}</p>
              </div>
            </div>

            <div className="sm:self-center pl-10 sm:pl-0">{step.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
