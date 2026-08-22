import { orpc } from "~/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { ThunderboltOutlined } from "@ant-design/icons";

interface CallHistorySectionProps {
  isLoadingUser?: boolean;
}

export function CallHistorySection({ isLoadingUser }: CallHistorySectionProps) {
  const { data: calls = [], isLoading: callsLoading } = useQuery(
    orpc.user.callHistory.queryOptions({
      input: { limit: 15, offset: 0 },
    })
  );

  const isLoading = isLoadingUser || callsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-white/5 border border-white/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col gap-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Sora'] tracking-tight">
          Call History
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-0.5">
          Past ephemeral 1:1 and small-group text connections initiated through InterChat Userphone.
        </p>
      </div>

      {calls.length === 0 ? (
        <div
          className="p-8 rounded-2xl border border-white/[0.08] text-center flex flex-col items-center justify-center gap-2"
          style={{ background: "#13141f" }}
        >
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl text-violet-400 mb-1">
            <ThunderboltOutlined />
          </div>
          <span className="text-sm font-bold text-white">No Call Records Found</span>
          <p className="text-xs text-white/50 max-w-xs">
            Start a text conversation with random users in connected Discord servers using <code className="px-1.5 py-0.5 rounded bg-white/10 text-violet-300">/call</code>.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {calls.map((call) => {
            const isClosed = call.status === "closed";
            const dateStr = new Date(call.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const durationMinutes = call.durationSeconds
              ? `${Math.floor(call.durationSeconds / 60)}m ${call.durationSeconds % 60}s`
              : "Ongoing";

            return (
              <div
                key={call.id}
                className="p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  background: "#13141f",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.5)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#5b4ccb]/30 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                    <ThunderboltOutlined />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block truncate">
                      {call.otherPartyServer}
                    </span>
                    <span className="text-[11px] text-white/50">
                      {call.otherPartyName} · {call.messageCount} messages
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block font-['Sora']">
                      {durationMinutes}
                    </span>
                    <span className="text-[10px] text-white/40 block">{dateStr}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isClosed
                        ? "bg-[#7ed493]/15 text-[#7ed493] border border-[#7ed493]/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {call.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
