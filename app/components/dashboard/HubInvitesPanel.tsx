import { CopyOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InputNumber, message, Modal, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { DashboardReadOnlyNotice, DashboardSectionCard, DashboardSectionTitle } from "./shared";

interface HubInvitesPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubInvitesPanel({ hub, canEdit }: HubInvitesPanelProps) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [maxUses, setMaxUses] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(86400);
  const createKeyRef = useRef(crypto.randomUUID());
  const revokeKeysRef = useRef(new Map<string, string>());

  const { data: invites = [], isLoading, isError } = useQuery(
    orpc.hub.listInvites.queryOptions({ input: { hubId: hub.metadata.id } })
  );

  const createMutation = useMutation(
    orpc.hub.createInvite.mutationOptions({
      onSuccess: () => {
        message.success("Invite created successfully.");
        setModalOpen(false);
        createKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listInvites.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to create invite."),
    })
  );

  const revokeMutation = useMutation(
    orpc.hub.revokeInvite.mutationOptions({
      onSuccess: () => {
        message.success("Invite revoked.");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listInvites.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to revoke invite."),
    })
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success("Invite code copied to clipboard!");
  };

  const revokeKeyFor = (inviteCode: string) => {
    const existing = revokeKeysRef.current.get(inviteCode);
    if (existing) return existing;
    const created = crypto.randomUUID();
    revokeKeysRef.current.set(inviteCode, created);
    return created;
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Invites</DashboardSectionTitle>}
      extra={
        canEdit && (
          <button
            type="button"
            className="dashboard-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            disabled={isLoading || isError}
            onClick={() => {
              createKeyRef.current = crypto.randomUUID();
              setModalOpen(true);
            }}
          >
            <PlusOutlined />
            <span>Create Invite</span>
          </button>
        )
      }
    >
      {!canEdit && <DashboardReadOnlyNotice message="Only staff with invite-management access can create or revoke invites." />}
      {isError && <span className="text-xs text-red-300">Invites are temporarily unavailable. Try again before making changes.</span>}
      
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="dashboard-subcard p-4 rounded-xl animate-pulse h-16" />
          ))}
        </div>
      ) : invites.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {invites.map((item) => (
            <div
              key={item.code}
              className="dashboard-subcard p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-[#1d1b2e]"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="font-mono text-xs font-bold text-[#c4b5fd] bg-violet-500/15 px-2 py-0.5 rounded border border-violet-500/30">
                    {item.code}
                  </code>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      item.maxUses > 0 && item.uses >= item.maxUses
                        ? "bg-red-500/15 text-red-300 border-red-500/30"
                        : "bg-sky-500/15 text-sky-300 border-sky-500/30"
                    }`}
                  >
                    {item.uses} / {item.maxUses > 0 ? item.maxUses : "∞"} uses
                  </span>
                </div>
                <span className="text-xs text-white/60">
                  Expires: {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "Never"}
                </span>
              </div>

              {canEdit && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.code)}
                    className="dashboard-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                    title="Copy invite code"
                  >
                    <CopyOutlined />
                    <span>Copy</span>
                  </button>
                  <Popconfirm
                    title="Revoke this invite code?"
                    description="This invite code will no longer allow servers to join."
                    okText="Revoke"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() =>
                      revokeMutation.mutate(
                        {
                          hubId: hub.metadata.id,
                          inviteCode: item.code,
                          idempotencyKey: revokeKeyFor(item.code),
                        },
                        { onSuccess: () => revokeKeysRef.current.delete(item.code) },
                      )
                    }
                  >
                    <button
                      type="button"
                      className="dashboard-btn-danger px-2.5 py-1.5 text-xs font-semibold"
                      title="Revoke invite"
                    >
                      <DeleteOutlined />
                    </button>
                  </Popconfirm>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="dashboard-subcard p-8 rounded-xl text-center flex flex-col items-center justify-center gap-2">
          <span className="text-sm font-bold text-white font-['Sora'] m-0">No active invites</span>
          <p className="text-xs text-white/50 max-w-sm m-0">
            Generate an invite code to allow Discord server administrators to link their channels to this Hub.
          </p>
        </div>
      )}

      <Modal
        title="Create Hub Invite"
        open={modalOpen}
        onOk={() =>
          createMutation.mutate({
            hubId: hub.metadata.id,
            maxUses,
            durationSeconds,
            idempotencyKey: createKeyRef.current,
          })
        }
        onCancel={() => setModalOpen(false)}
        confirmLoading={createMutation.isPending}
        okText="Generate"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          <div>
            <span className="text-xs text-white/70 block mb-1">
              Max Uses (0 = unlimited)
            </span>
            <InputNumber
              value={maxUses}
              onChange={(val) => setMaxUses(val || 0)}
              min={0}
              max={1000}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <span className="text-xs text-white/70 block mb-1">
              Duration in Seconds (0 = never expires)
            </span>
            <InputNumber
              value={durationSeconds}
              onChange={(val) => setDurationSeconds(val || 0)}
              min={0}
              step={3600}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}
