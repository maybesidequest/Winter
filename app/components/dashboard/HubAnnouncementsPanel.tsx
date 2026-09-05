import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { AnnouncementEditorModal } from "./announcements/AnnouncementEditorModal";
import { AnnouncementItemCard } from "./announcements/AnnouncementItemCard";
import { useHubAnnouncementsMutations } from "./announcements/useHubAnnouncementsMutations";
import { DashboardReadOnlyNotice, DashboardSectionCard, DashboardSectionTitle } from "./shared";

interface HubAnnouncementsPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubAnnouncementsPanel({ hub, canEdit }: HubAnnouncementsPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("Announcement");
  const [content, setContent] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [repeatIntervalMinutes, setRepeatIntervalMinutes] = useState(0);
  const [desiredState, setDesiredState] = useState<"DRAFT" | "SCHEDULED" | "PAUSED">("DRAFT");

  const { data: announcements = [], isLoading, isError } = useQuery(
    orpc.hub.listAnnouncements.queryOptions({ input: { hubId: hub.metadata.id } })
  );

  const resetForm = () => {
    setModalOpen(false);
    setEditingId(null);
    setTitle("Announcement");
    setContent("");
    setScheduledFor("");
    setRepeatIntervalMinutes(0);
    setDesiredState("DRAFT");
  };

  const {
    createMutation,
    updateMutation,
    deleteMutation,
    transitionMutation,
    deleteKeyFor,
    deleteKeysRef,
    createKeyRef,
    updateKeyRef,
  } = useHubAnnouncementsMutations({
    hubId: hub.metadata.id,
    onMutationSuccess: resetForm,
  });

  const handleSubmit = () => {
    if (content.trim().length < 3) return message.error("Content must be at least 3 characters.");
    const schedule = scheduledFor ? new Date(scheduledFor).toISOString() : undefined;
    const nextState = schedule ? desiredState : "DRAFT";
    if (editingId) {
      const current = announcements.find((item) => item.id === editingId);
      if (!current) return message.error("Refresh before editing this announcement.");
      updateMutation.mutate({
        hubId: hub.metadata.id,
        announcementId: editingId,
        content: content.trim(),
        title: title.trim(),
        scheduledFor: schedule,
        repeatIntervalSeconds: repeatIntervalMinutes * 60,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        desiredState: nextState,
        expectedVersion: current.version,
        idempotencyKey: updateKeyRef.current,
      });
    } else {
      createMutation.mutate({
        hubId: hub.metadata.id,
        content: content.trim(),
        title: title.trim(),
        scheduledFor: schedule,
        repeatIntervalSeconds: repeatIntervalMinutes * 60,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        desiredState: nextState,
        idempotencyKey: createKeyRef.current,
      });
    }
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Announcements</DashboardSectionTitle>}
      extra={
        canEdit && (
          <button
            type="button"
            className="dashboard-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            disabled={isLoading || isError}
            onClick={() => {
              setEditingId(null);
              setTitle("Announcement");
              setContent("");
              setScheduledFor("");
              setRepeatIntervalMinutes(0);
              setDesiredState("DRAFT");
              createKeyRef.current = crypto.randomUUID();
              setModalOpen(true);
            }}
          >
            <PlusOutlined />
            <span>New Announcement</span>
          </button>
        )
      }
    >
      {!canEdit && <DashboardReadOnlyNotice message="Only staff with announcement access can publish changes." />}
      {isError && <span className="text-xs text-red-300">Announcements are temporarily unavailable. Try again before making changes.</span>}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="dashboard-subcard p-4 rounded-xl animate-pulse h-20" />
          ))}
        </div>
      ) : announcements.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {announcements.map((item) => (
            <AnnouncementItemCard
              key={item.id}
              item={item}
              canEdit={canEdit}
              onToggleState={() =>
                transitionMutation.mutate({
                  hubId: hub.metadata.id,
                  announcementId: item.id,
                  desiredState: item.desiredState === "SCHEDULED" ? "PAUSED" : "SCHEDULED",
                  expectedVersion: item.version,
                  idempotencyKey: crypto.randomUUID(),
                })
              }
              onEdit={() => {
                setEditingId(item.id);
                setTitle(item.title);
                setContent(item.content);
                setScheduledFor(item.nextDelivery ? new Date(item.nextDelivery).toISOString().slice(0, 16) : "");
                setRepeatIntervalMinutes(Math.floor(item.repeatIntervalSeconds / 60));
                setDesiredState(item.desiredState);
                updateKeyRef.current = crypto.randomUUID();
                setModalOpen(true);
              }}
              onDelete={() =>
                deleteMutation.mutate(
                  {
                    hubId: hub.metadata.id,
                    announcementId: item.id,
                    expectedVersion: item.version,
                    idempotencyKey: deleteKeyFor(item.id),
                  },
                  { onSuccess: () => deleteKeysRef.current.delete(item.id) },
                )
              }
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-subcard p-8 rounded-xl text-center flex flex-col items-center justify-center gap-2">
          <span className="text-sm font-bold text-white font-['Sora'] m-0">No announcements posted</span>
          <p className="text-xs text-white/50 max-w-sm m-0">
            Publish cross-server announcements or configure recurring dispatches to all connected Discord channels.
          </p>
        </div>
      )}

      <AnnouncementEditorModal
        open={modalOpen}
        isEditing={Boolean(editingId)}
        isPending={createMutation.isPending || updateMutation.isPending}
        title={title}
        content={content}
        scheduledFor={scheduledFor}
        repeatIntervalMinutes={repeatIntervalMinutes}
        desiredState={desiredState}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onScheduledForChange={setScheduledFor}
        onRepeatIntervalMinutesChange={setRepeatIntervalMinutes}
        onDesiredStateChange={setDesiredState}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </DashboardSectionCard>
  );
}
