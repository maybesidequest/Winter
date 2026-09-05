import { HistoryOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { DashboardSectionCard, DashboardSectionTitle } from "./shared";

export function HubAuditPanel({ hub }: { hub: HubResource }) {
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const query = useQuery(
    orpc.hub.listAudit.queryOptions({ input: { hubId: hub.metadata.id, limit, offset } })
  );

  const entries = query.data?.entries || [];

  return (
    <DashboardSectionCard title={<DashboardSectionTitle>Audit History</DashboardSectionTitle>}>
      {query.isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dashboard-subcard p-4 rounded-xl animate-pulse h-16" />
          ))}
        </div>
      ) : query.isError ? (
        <div role="alert" className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-200">
          Audit history is temporarily unavailable. Please reload the page.
        </div>
      ) : entries.length > 0 ? (
        <div className="flex flex-col gap-2">
          {entries.map((entry, idx) => (
            <div
              key={entry.id || idx}
              className="dashboard-subcard p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-[#1d1b2e]"
            >
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="text-sm font-semibold text-white/95 leading-normal break-words">
                  {entry.summary}
                </span>
                <div className="flex items-center gap-2 flex-wrap text-xs text-white/50">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    {entry.eventType}
                  </span>
                  <span>·</span>
                  <span>{entry.source || "Control Plane"}</span>
                  <span>·</span>
                  <span>
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "Unknown time"}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {query.data?.hasMore && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                className="dashboard-btn-secondary px-4 py-2 text-xs font-bold"
                onClick={() => setOffset((value) => value + limit)}
              >
                Load Older Changes
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-subcard p-8 rounded-xl text-center flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 text-lg shadow-[0_1.5px_0_0_rgba(129,117,238,0.25)]">
            <HistoryOutlined />
          </div>
          <span className="text-sm font-bold text-white font-['Sora'] m-0">No changes recorded</span>
          <p className="text-xs text-white/50 max-w-sm m-0">
            Audit entries will appear here when security, policy, or bridge configuration mutations occur.
          </p>
        </div>
      )}
    </DashboardSectionCard>
  );
}
