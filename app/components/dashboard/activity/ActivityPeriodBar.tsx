import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons";

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
        <select
          aria-label="Activity month"
          value={month}
          onChange={(e) => onPeriodChange(year, Number(e.target.value))}
          className="text-xs font-bold py-1.5 px-3 min-h-[36px] bg-[#13141f] border border-white/10 rounded-xl text-white cursor-pointer focus:border-[#8175ee] focus:outline-none"
        >
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={index + 1} className="bg-[#13141f] text-white">
              {name}
            </option>
          ))}
        </select>

        <select
          aria-label="Activity year"
          value={year}
          onChange={(e) => onPeriodChange(Number(e.target.value), month)}
          className="text-xs font-bold py-1.5 px-3 min-h-[36px] bg-[#13141f] border border-white/10 rounded-xl text-white cursor-pointer focus:border-[#8175ee] focus:outline-none"
        >
          {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
            <option key={y} value={y} className="bg-[#13141f] text-white">
              {y}
            </option>
          ))}
        </select>

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

