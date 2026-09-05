import { HistoryOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { useState } from "react";
import type { Infraction } from "~/services/control/moderation.shared";

function label(value: string) {
  return value
    .replace(/^(INFRACTION_LIFECYCLE_STATE_|SANCTION_ENFORCEMENT_STATUS_|SANCTION_TYPE_)/, "")
    .replaceAll("_", " ")
    .toLowerCase();
}

function when(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Not observed";
}

export function InfractionList({
  infractions,
  onRevoke,
}: {
  infractions: Infraction[];
  onRevoke?: (infraction: Infraction, reason: string) => void;
}) {
  const [revokeReason, setRevokeReason] = useState("");

  if (infractions.length === 0) {
    return (
      <div className="py-8 text-center rounded-xl bg-[#181726] border border-white/[0.06] flex flex-col items-center gap-2">
        <HistoryOutlined className="text-2xl text-white/30" />
        <p className="m-0 text-xs text-white/50">No moderation records or sanctions logged for this Hub.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {infractions.map((item) => {
        const isActive = item.lifecycleState === "INFRACTION_LIFECYCLE_STATE_ACTIVE";

        return (
          <article
            key={item.id}
            className="flex flex-col gap-2.5 p-4 rounded-xl bg-[#181726] border border-white/[0.08] text-xs shadow-[0_2px_0_0_rgba(10,8,23,0.3)] transition-all hover:border-white/15"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <strong className="capitalize text-white font-bold text-sm">{label(item.type)}</strong>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${
                    isActive
                      ? "border-red-500/30 bg-red-500/15 text-red-300"
                      : "border-white/10 bg-white/5 text-white/60"
                  }`}
                >
                  {label(item.lifecycleState)}
                </span>
              </div>
              <span className="text-white/40 text-xs font-mono">ID: {item.id.slice(0, 8)}</span>
            </div>

            <p className="m-0 text-white/80 leading-relaxed font-sans">{item.reason}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.04] text-white/50">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>Enforcement: <strong className="text-white/70 capitalize">{label(item.enforcement.status)}</strong></span>
                <span>Observed: {when(item.enforcement.observedAt)}</span>
                {item.enforcement.error && <span className="text-red-300 font-medium">{item.enforcement.error}</span>}
              </div>

              {onRevoke && isActive && (
                <Popconfirm
                  title="Revoke this sanction?"
                  description={
                    <div className="flex flex-col gap-2 pt-1">
                      <label className="text-xs text-white/80" htmlFor={`revoke-reason-${item.id}`}>
                        Reason (recorded in audit log)
                      </label>
                      <input
                        id={`revoke-reason-${item.id}`}
                        className="w-60 rounded-lg border border-white/20 bg-[#13141f] text-white px-2.5 py-1 text-xs focus:outline-none focus:border-violet-400"
                        maxLength={2_000}
                        value={revokeReason}
                        onChange={(event) => setRevokeReason(event.target.value)}
                        placeholder="Reason for revoking sanction…"
                      />
                    </div>
                  }
                  okText="Revoke Sanction"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onRevoke(item, revokeReason.trim() || "Revoked via dashboard")}
                >
                  <button type="button" className="dashboard-btn-secondary !min-h-[28px] !px-3 !py-0.5 !text-xs !font-bold cursor-pointer">
                    Revoke Sanction
                  </button>
                </Popconfirm>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
