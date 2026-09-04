import { ReloadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useOutletContext, useSearchParams } from "react-router";
import { ActivityMetricsGrid } from "~/components/dashboard/activity/ActivityMetricsGrid";
import { ActivityPeriodBar } from "~/components/dashboard/activity/ActivityPeriodBar";
import { TopHubsCard } from "~/components/dashboard/activity/TopHubsCard";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { orpc } from "~/lib/orpc";

export default function DashboardActivity() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;

  const parsedYear = Number(searchParams.get("year"));
  const parsedMonth = Number(searchParams.get("month"));

  const year = parsedYear >= 2000 && parsedYear <= 2200 ? parsedYear : currentYear;
  const month = parsedMonth >= 1 && parsedMonth <= 12 ? parsedMonth : currentMonth;

  const handlePeriodChange = (newYear: number, newMonth: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newYear === currentYear && newMonth === currentMonth) {
        next.delete("year");
        next.delete("month");
      } else {
        next.set("year", String(newYear));
        next.set("month", String(newMonth));
      }
      return next;
    });
  };

  const activity = useQuery({
    ...orpc.user.getActivity.queryOptions({ input: { year, month, limit: 6 } }),
    enabled: Boolean(capabilities.USER_ACTIVITY || import.meta.env.DEV),
  });

  if (!capabilities.USER_ACTIVITY && !import.meta.env.DEV) {
    return <Navigate to="/dashboard" replace />;
  }

  const data = activity.data;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Activity"
        title="Your Activity"
        description="A clear view of your messages, streaks, and participation across InterChat."
      />

      <ActivityPeriodBar
        year={year}
        month={month}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPeriodChange={handlePeriodChange}
      />

      {activity.isLoading && (
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-28 bg-white/[0.04] rounded-2xl" />
            <div className="h-28 bg-white/[0.04] rounded-2xl" />
            <div className="h-28 bg-white/[0.04] rounded-2xl" />
          </div>
          <div className="h-56 bg-white/[0.04] rounded-2xl" />
        </div>
      )}

      {activity.isError && (
        <div className="rounded-2xl p-6 border border-red-500/30 bg-red-500/10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-bold text-white m-0">Activity Unavailable</h3>
            <p className="text-xs text-red-200/80 m-0 mt-1">
              Your activity records could not be loaded at this time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => activity.refetch()}
            className="dashboard-btn-secondary !min-h-[34px] !px-3.5 !py-1.5 !text-xs !font-bold flex items-center gap-1.5"
          >
            <ReloadOutlined className="text-xs" />
            <span>Try again</span>
          </button>
        </div>
      )}

      {data && (
        <>
          <ActivityMetricsGrid
            messages={data.lifetimeMessages}
            messageRank={data.messageRank}
            currentStreak={data.currentStreak}
            longestStreak={data.longestStreak}
          />

          <TopHubsCard topHubs={data.topHubs} />
        </>
      )}
    </div>
  );
}
