import { ClockCircleOutlined, SendOutlined } from "@ant-design/icons";
import type { Infraction } from "~/services/control/moderation.shared";

interface InfractionCardProps {
  infraction: Infraction;
  onAppeal: () => void;
}

export function InfractionCard({ infraction, onAppeal }: InfractionCardProps) {
  const cleanType = infraction.type.replace("SANCTION_TYPE_", "");
  const isBan = infraction.type === "SANCTION_TYPE_BAN";
  const isMute = infraction.type === "SANCTION_TYPE_MUTE";

  const badgeStyle = isBan
    ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
    : isMute
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-violet-500/15 text-violet-300 border-violet-500/30";

  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-white/[0.05]">
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold border uppercase tracking-wide ${badgeStyle}`}>
            {cleanType}
          </span>
          <span className="text-sm font-semibold text-white truncate">{infraction.hubName || "Hub Sanction"}</span>
          {infraction.createdAt && (
            <span className="text-xs text-white/40 flex items-center gap-1 shrink-0">
              <ClockCircleOutlined />
              {new Date(infraction.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="text-xs text-white/70 m-0 leading-relaxed">
          <span className="text-white/40 font-medium">Reason: </span>
          {infraction.reason}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onAppeal}
          className="dashboard-btn-primary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
        >
          <SendOutlined />
          <span>Appeal sanction</span>
        </button>
      </div>
    </div>
  );
}

