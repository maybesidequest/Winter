import { RobotOutlined, BookOutlined, CustomerServiceOutlined, KeyOutlined } from "@ant-design/icons";
import type { UserResource } from "~/resources/user";

interface BotConfigSectionProps {
  userResource?: UserResource;
  isLoading?: boolean;
}

export function BotConfigSection({ userResource, isLoading }: BotConfigSectionProps) {
  const isStaff = userResource?.status.isStaff ?? false;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        <div className="h-20 rounded-2xl bg-white/5 border border-white/10" />
        <div className="h-32 rounded-2xl bg-white/5 border border-white/10" />
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col gap-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Sora'] tracking-tight">
          Bot & Infrastructure
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-0.5">
          Global InterChat bot runtime configurations, operational quotas, and developer privileges.
        </p>
      </div>

      {/* Staff & Dev Status Banner */}
      <div
        className="p-4 rounded-2xl border flex items-center justify-between gap-3"
        style={{
          background: isStaff ? "rgba(129, 117, 238, 0.15)" : "#13141f",
          borderColor: isStaff ? "rgba(129, 117, 238, 0.35)" : "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.5)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-base text-violet-300 flex-shrink-0">
            <KeyOutlined />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-white block">
              {isStaff ? "Privileged Access Enabled" : "Standard Community Member"}
            </span>
            <span className="text-[11px] text-white/50">
              {isStaff
                ? "Iris AuthZ administrator credentials active for global hub management."
                : "Standard rate limits and per-hub manager permissions apply."}
            </span>
          </div>
        </div>
      </div>

      {/* Operational Quotas Card */}
      <div
        className="p-4 rounded-2xl border flex flex-col gap-3"
        style={{
          background: "#13141f",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.4)",
        }}
      >
        <h4 className="text-xs sm:text-sm font-bold text-white">System Runtime & Limits</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
            <span className="text-white/60">Webhook Fanout:</span>
            <span className="font-mono text-violet-300 font-bold">Prism Async</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
            <span className="text-white/60">AuthZ Policy Engine:</span>
            <span className="font-mono text-emerald-300 font-bold">Iris Go</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
            <span className="text-white/60">Content Safety Engine:</span>
            <span className="font-mono text-blue-300 font-bold">Polarizer</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
            <span className="text-white/60">Event Bus:</span>
            <span className="font-mono text-amber-300 font-bold">Redis Streams</span>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://interchat.gg/docs"
          target="_blank"
          rel="noreferrer"
          className="dashboard-pill-btn p-3.5 rounded-2xl flex items-center gap-3 no-underline text-white hover:text-white"
        >
          <BookOutlined className="text-base text-violet-400" />
          <div className="text-left">
            <span className="text-xs font-bold block">Documentation</span>
            <span className="text-[10px] text-white/50">Read bot setup and guide</span>
          </div>
        </a>

        <a
          href="https://discord.gg/interchat"
          target="_blank"
          rel="noreferrer"
          className="dashboard-pill-btn p-3.5 rounded-2xl flex items-center gap-3 no-underline text-white hover:text-white"
        >
          <CustomerServiceOutlined className="text-base text-emerald-400" />
          <div className="text-left">
            <span className="text-xs font-bold block">Support Server</span>
            <span className="text-[10px] text-white/50">Join our Discord community</span>
          </div>
        </a>
      </div>
    </div>
  );
}
