import { CheckOutlined, IdcardOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { DashboardReadOnlyNotice, DashboardSectionCard, DashboardSectionTitle } from "./shared";

interface HubBadgesPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubBadgesPanel({ hub, canEdit }: HubBadgesPanelProps) {
  const queryClient = useQueryClient();
  const [ownerBadge, setOwnerBadge] = useState<string>("");
  const [managerBadge, setManagerBadge] = useState<string>("");
  const [moderatorBadge, setModeratorBadge] = useState<string>("");
  const saveKeyRef = useRef(crypto.randomUUID());
  const submittedDraftRef = useRef<string | null>(null);
  const badgesQuery = useQuery(orpc.hub.getBadges.queryOptions({ input: { hubId: hub.metadata.id } }));

  useEffect(() => {
    if (!badgesQuery.data) return;
    setOwnerBadge(badgesQuery.data.ownerBadge || "");
    setManagerBadge(badgesQuery.data.managerBadge || "");
    setModeratorBadge(badgesQuery.data.moderatorBadge || "");
  }, [badgesQuery.data]);

  const patchBadgesMutation = useMutation(
    orpc.hub.patchBadges.mutationOptions({
      onSuccess: () => {
        message.success("Badges configuration saved.");
        submittedDraftRef.current = null;
        saveKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
        queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to update badges."),
    })
  );

  const handleSave = () => {
    const input = {
      hubId: hub.metadata.id,
      ownerBadge: ownerBadge.trim() || undefined,
      managerBadge: managerBadge.trim() || undefined,
      moderatorBadge: moderatorBadge.trim() || undefined,
      expectedVersion: hub.version,
    };
    const draft = JSON.stringify(input);
    if (submittedDraftRef.current !== draft) {
      saveKeyRef.current = crypto.randomUUID();
      submittedDraftRef.current = draft;
    }
    patchBadgesMutation.mutate({ ...input, idempotencyKey: saveKeyRef.current });
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Staff Badges</DashboardSectionTitle>}
      extra={
        canEdit && (
          <button
            type="button"
            disabled={badgesQuery.isLoading || badgesQuery.isError || patchBadgesMutation.isPending}
            onClick={handleSave}
            className="dashboard-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <CheckOutlined />
            <span>{patchBadgesMutation.isPending ? "Saving..." : "Save Badges"}</span>
          </button>
        )
      }
    >
      {!canEdit && <DashboardReadOnlyNotice message="Only Hub managers can change staff badges." />}

      <div className="flex flex-col gap-6">
        {badgesQuery.isLoading && <span className="text-xs text-white/60">Loading badge settings…</span>}
        {badgesQuery.isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
            Badge settings are temporarily unavailable. Try refreshing the page.
          </div>
        )}

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">Owner Badge</label>
            <input
              type="text"
              value={ownerBadge}
              onChange={(e) => setOwnerBadge(e.target.value)}
              placeholder="e.g. 👑 or <:crown:12345>"
              maxLength={32}
              disabled={!canEdit || badgesQuery.isLoading || badgesQuery.isError}
              className="dashboard-input text-xs"
            />
            <span className="text-[11px] text-white/60">Appended to Hub Owner messages</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">Manager Badge</label>
            <input
              type="text"
              value={managerBadge}
              onChange={(e) => setManagerBadge(e.target.value)}
              placeholder="e.g. 🛡️ or <:shield:12345>"
              maxLength={32}
              disabled={!canEdit || badgesQuery.isLoading || badgesQuery.isError}
              className="dashboard-input text-xs"
            />
            <span className="text-[11px] text-white/60">Appended to Manager messages</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">Moderator Badge</label>
            <input
              type="text"
              value={moderatorBadge}
              onChange={(e) => setModeratorBadge(e.target.value)}
              placeholder="e.g. ⚔️ or <:sword:12345>"
              maxLength={32}
              disabled={!canEdit || badgesQuery.isLoading || badgesQuery.isError}
              className="dashboard-input text-xs"
            />
            <span className="text-[11px] text-white/60">Appended to Moderator messages</span>
          </div>
        </div>

        {/* Live Chat Relay Preview */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wide flex items-center gap-1.5">
            <IdcardOutlined className="text-violet-400" />
            <span>Chat Relay Preview</span>
          </span>

          <div className="rounded-xl border border-white/[0.08] bg-[#0e0d17]/80 p-4 flex flex-col gap-3 font-['Inter']">
            {/* Owner sample */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-400/30 flex items-center justify-center text-xs font-bold text-violet-200">
                OW
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Alex</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-semibold border border-amber-400/30">
                    {ownerBadge.trim() || "👑"} Owner
                  </span>
                  <span className="text-[10px] text-white/40">Today at 9:42 PM</span>
                </div>
                <p className="text-xs text-white/80 m-0">
                  Welcome everyone to the cross-server discussion channel!
                </p>
              </div>
            </div>

            {/* Moderator sample */}
            <div className="flex items-start gap-3 pt-2 border-t border-white/[0.04]">
              <div className="w-8 h-8 rounded-full bg-sky-600/30 border border-sky-400/30 flex items-center justify-center text-xs font-bold text-sky-200">
                MD
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Sam</span>
                  <span className="text-[10px] bg-purple-400/20 text-purple-200 px-1.5 py-0.2 rounded font-semibold border border-purple-400/30">
                    {moderatorBadge.trim() || "⚔️"} Moderator
                  </span>
                  <span className="text-[10px] text-white/40">Today at 9:44 PM</span>
                </div>
                <p className="text-xs text-white/80 m-0">
                  Please keep discussion on-topic according to rule #1.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardSectionCard>
  );
}
