import { ClockCircleOutlined, SyncOutlined } from "@ant-design/icons";
import type { SubmittedAppealRecord } from "./types";

interface SubmittedAppealsSectionProps {
  records: SubmittedAppealRecord[];
}

export function SubmittedAppealsSection({ records }: SubmittedAppealsSectionProps) {
  if (records.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-['Sora'] text-sm font-bold text-white/90 m-0">Appeals Under Review</h3>
        <span className="text-xs text-violet-300 font-semibold bg-violet-500/10 border border-violet-400/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
          <SyncOutlined spin className="text-xs" />
          <span>{records.length} pending</span>
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {records.map((record) => {
          const cleanType = record.sanctionType.replace("SANCTION_TYPE_", "");
          return (
            <div
              key={record.infractionId}
              className="p-3.5 rounded-xl border border-violet-400/20 bg-violet-500/[0.04] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold border uppercase bg-white/10 text-white/80 border-white/15">
                    {cleanType}
                  </span>
                  <span className="text-sm font-semibold text-white">{record.hubName || "Hub Sanction"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <ClockCircleOutlined />
                  <span>Submitted {new Date(record.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="text-xs text-white/60 pl-2.5 border-l-2 border-violet-400/40 italic">
                “{record.appealReason}”
              </div>

              <p className="text-xs text-white/50 m-0 mt-0.5">
                Staff from <strong className="text-white/80">{record.hubName || "the Hub"}</strong> have received your
                appeal. Decisions are made according to the Hub&apos;s safety guidelines.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

