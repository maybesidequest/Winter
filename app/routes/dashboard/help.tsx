import { InfoCircleOutlined } from "@ant-design/icons";
import { Navigate, useOutletContext } from "react-router";
import { HelpFeedbackForm } from "~/components/dashboard/help/HelpFeedbackForm";
import { HelpResourcesGrid } from "~/components/dashboard/help/HelpResourcesGrid";
import { HelpTopicsSearch } from "~/components/dashboard/help/HelpTopicsSearch";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

export default function DashboardHelp() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const isFeedbackEnabled = Boolean(capabilities.USER_FEEDBACK || import.meta.env.DEV);

  if (!capabilities.USER_HELP && !import.meta.env.DEV) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Help"
        title="Help & Resources"
        description="Find quick answers, invite the Discord bot, explore Hub guidelines, and send feedback."
      />

      {/* Quick Link Resource Cards */}
      <HelpResourcesGrid />

      {/* Frequently Asked Questions */}
      <HelpTopicsSearch />

      {/* User Feedback Submission Form */}
      {isFeedbackEnabled && <HelpFeedbackForm />}

      {/* Informational Guidance Callout */}
      <div
        className="rounded-2xl p-5 border flex items-start gap-3.5"
        style={dashboardGlassCardStyle}
      >
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-sm text-violet-300 flex-shrink-0 mt-0.5">
          <InfoCircleOutlined />
        </div>
        <div className="text-xs leading-relaxed text-white/60">
          <strong className="text-white font-semibold block mb-0.5 font-['Sora']">
            Using InterChat Across Discord & Dashboard
          </strong>
          <span>
            Use the Discord bot directly inside your Discord server for in-channel chat relays,
            voice calls, and userphone sessions. Use this web control plane to manage Hub
            networks, configure bridge permissions, and review cross-server analytics.
          </span>
        </div>
      </div>
    </div>
  );
}
