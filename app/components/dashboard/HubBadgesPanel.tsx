import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Typography, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { orpc } from "~/lib/orpc";
import { DashboardSectionCard, DashboardSectionTitle } from "./shared";
import type { HubResource } from "~/resources/hub";

const { Text } = Typography;

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
          <Button
            type="primary"
            size="small"
            icon={<SaveOutlined />}
            className="dashboard-btn-primary"
            loading={patchBadgesMutation.isPending}
            disabled={badgesQuery.isLoading || badgesQuery.isError}
            onClick={handleSave}
          >
            Save Badges
          </Button>
        )
      }
    >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {badgesQuery.isLoading && <Text type="secondary">Loading badge settings…</Text>}
          {badgesQuery.isError && <Text type="danger">Badge settings are temporarily unavailable. Try again before saving.</Text>}
        <div>
          <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
            Owner Badge Emoji / String
          </Text>
            <Input
              value={ownerBadge}
              onChange={(e) => setOwnerBadge(e.target.value)}
              placeholder="e.g. 👑 or <:crown:12345>"
              maxLength={100}
            disabled={!canEdit || badgesQuery.isLoading || badgesQuery.isError}
          />
        </div>
        <div>
          <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
            Manager Badge Emoji / String
          </Text>
          <Input
            value={managerBadge}
            onChange={(e) => setManagerBadge(e.target.value)}
              placeholder="e.g. 🛡️ or <:shield:12345>"
              maxLength={100}
            disabled={!canEdit || badgesQuery.isLoading || badgesQuery.isError}
          />
        </div>
        <div>
          <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
            Moderator Badge Emoji / String
          </Text>
          <Input
            value={moderatorBadge}
            onChange={(e) => setModeratorBadge(e.target.value)}
              placeholder="e.g. ⚔️ or <:sword:12345>"
              maxLength={100}
            disabled={!canEdit || badgesQuery.isLoading || badgesQuery.isError}
          />
        </div>
      </div>
    </DashboardSectionCard>
  );
}
