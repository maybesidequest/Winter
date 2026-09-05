import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons";
import { DashboardSelect } from "~/components/dashboard/shared";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface ActivityPeriodBarProps {
  year: number;
  month: number;
  currentYear: number;
  currentMonth: number;
  onPeriodChange: (year: number, month: number) => void;
}

export function ActivityPeriodBar({
  year,
  month,
  currentYear,
  currentMonth,
  onPeriodChange,
}: ActivityPeriodBarProps) {
  const isCurrent = year === currentYear && month === currentMonth;

  return (
    <div className="rounded-2xl p-4 border flex flex-wrap items-center justify-between gap-3 bg-[#13141f] border-white/[0.08]">
      <div className="flex items-center gap-2.5 text-xs text-white/60">
        <CalendarOutlined className="text-violet-400 text-sm" />
        <span className="font-bold uppercase tracking-wider text-white/70">
          Activity Period:
        </span>
        <span className="font-semibold text-white font-['Sora']">
          {MONTH_NAMES[month - 1]} {year}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <DashboardSelect<number>
          aria-label="Activity month"
          value={month}
          onChange={(val) => onPeriodChange(year, val)}
          options={MONTH_NAMES.map((name, index) => ({
            value: index + 1,
            label: name,
          }))}
          style={{ width: 130 }}
        />

        <DashboardSelect<number>
          aria-label="Activity year"
          value={year}
          onChange={(val) => onPeriodChange(val, month)}
          options={[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => ({
            value: y,
            label: String(y),
          }))}
          style={{ width: 100 }}
        />

        {!isCurrent && (
          <button
            type="button"
            onClick={() => onPeriodChange(currentYear, currentMonth)}
            className="dashboard-btn-secondary !min-h-[36px] !px-3 !py-1.5 !text-xs !font-bold flex items-center gap-1.5"
          >
            <ReloadOutlined className="text-xs" />
            <span>Current month</span>
          </button>
        )}
      </div>
    </div>
  );
}

