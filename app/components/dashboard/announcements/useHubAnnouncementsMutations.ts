import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRef } from "react";
import { orpc } from "~/lib/orpc";

interface UseHubAnnouncementsMutationsOptions {
  hubId: string;
  onMutationSuccess?: () => void;
}

export function useHubAnnouncementsMutations({
  hubId,
  onMutationSuccess,
}: UseHubAnnouncementsMutationsOptions) {
  const queryClient = useQueryClient();
  const createKeyRef = useRef(crypto.randomUUID());
  const updateKeyRef = useRef(crypto.randomUUID());
  const deleteKeysRef = useRef(new Map<string, string>());

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: orpc.hub.listAnnouncements.queryOptions({ input: { hubId } }).queryKey,
    });
  };

  const createMutation = useMutation(
    orpc.hub.createAnnouncement.mutationOptions({
      onSuccess: async () => {
        message.success("Announcement queued for delivery.");
        createKeyRef.current = crypto.randomUUID();
        await invalidate();
        onMutationSuccess?.();
      },
      onError: (err) => message.error(err.message || "Failed to create announcement."),
    })
  );

  const updateMutation = useMutation(
    orpc.hub.updateAnnouncement.mutationOptions({
      onSuccess: async () => {
        message.success("Announcement updated.");
        updateKeyRef.current = crypto.randomUUID();
        await invalidate();
        onMutationSuccess?.();
      },
      onError: (err) => message.error(err.message || "Failed to update announcement."),
    })
  );

  const deleteMutation = useMutation(
    orpc.hub.deleteAnnouncement.mutationOptions({
      onSuccess: async () => {
        message.success("Announcement deleted.");
        await invalidate();
      },
      onError: (err) => message.error(err.message || "Failed to delete announcement."),
    })
  );

  const transitionMutation = useMutation(
    orpc.hub.transitionAnnouncement.mutationOptions({
      onSuccess: async () => {
        message.success("Announcement state updated.");
        await invalidate();
      },
      onError: (err) => message.error(err.message || "Failed to update announcement state."),
    })
  );

  const deleteKeyFor = (announcementId: string) => {
    const existing = deleteKeysRef.current.get(announcementId);
    if (existing) return existing;
    const created = crypto.randomUUID();
    deleteKeysRef.current.set(announcementId, created);
    return created;
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    transitionMutation,
    deleteKeyFor,
    createKeyRef,
    updateKeyRef,
    deleteKeysRef,
  };
}

