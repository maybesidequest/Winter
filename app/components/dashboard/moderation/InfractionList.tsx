import { Popconfirm } from "antd";
import { useState } from "react";
import type { Infraction } from "~/services/control/moderation";

function label(value: string) { return value.replace(/^(INFRACTION_LIFECYCLE_STATE_|SANCTION_ENFORCEMENT_STATUS_|SANCTION_TYPE_)/, "").replaceAll("_", " ").toLowerCase(); }
function when(value: string | null) { return value ? new Date(value).toLocaleString() : "Not observed"; }

export function InfractionList({ infractions, onRevoke }: { infractions: Infraction[]; onRevoke?: (infraction: Infraction, reason: string) => void }) {
  const [revokeReason, setRevokeReason] = useState("");
  if (infractions.length === 0) return <p className="m-0 text-xs text-white/60">No matching moderation records.</p>;
  return (
    <div className="divide-y divide-white/[0.06]">
      {infractions.map((item) => (
        <article key={item.id} className="flex flex-col gap-2 py-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="capitalize text-white">{label(item.type)}</strong>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-white/75">Lifecycle: {label(item.lifecycleState)}</span>
          </div>
          <p className="m-0 text-white/70">{item.reason}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/50">
            <span>Enforcement: {label(item.enforcement.status)}</span>
            <span>Observed: {when(item.enforcement.observedAt)}</span>
            {item.enforcement.error && <span className="text-red-300">{item.enforcement.error}</span>}
          </div>
          {onRevoke && item.lifecycleState === "INFRACTION_LIFECYCLE_STATE_ACTIVE" && (
            <Popconfirm
              title="Revoke this sanction?"
              description={
                <div className="flex flex-col gap-2">
                  <label className="text-xs" htmlFor={`revoke-reason-${item.id}`}>Reason (recorded in the audit trail)</label>
                  <input
                    id={`revoke-reason-${item.id}`}
                    className="w-56 rounded border border-black/15 px-2 py-1 text-xs"
                    maxLength={2_000}
                    value={revokeReason}
                    onChange={(event) => setRevokeReason(event.target.value)}
                    placeholder="Why is this sanction being revoked?"
                  />
                </div>
              }
              okText="Revoke sanction"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => onRevoke(item, revokeReason.trim() || "Revoked via dashboard")}
            >
              <button type="button" className="dashboard-btn-secondary w-fit px-3 py-1 text-xs">Revoke sanction</button>
            </Popconfirm>
          )}
        </article>
      ))}
    </div>
  );
}
