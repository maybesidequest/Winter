import { useState } from "react";
import { Modal, Select, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LinkOutlined, ClusterOutlined } from "@ant-design/icons";
import { orpc } from "~/lib/orpc";
import type { HubPublicResource } from "~/resources/hubDiscovery";

interface HubConnectModalProps {
  hub: HubPublicResource | null;
  open: boolean;
  onCancel: () => void;
}

export function HubConnectModal({ hub, open, onCancel }: HubConnectModalProps) {
  const [selectedServerId, setSelectedServerId] = useState<string | undefined>();
  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>();
  const [inviteCode, setInviteCode] = useState("");
  const queryClient = useQueryClient();

  // Load manageable servers
  const { data: servers = [], isLoading: isLoadingServers } = useQuery({
    ...orpc.server.list.queryOptions(),
    enabled: open,
  });

  // Load channels for the selected server
  const { data: channels = [], isLoading: isLoadingChannels } = useQuery({
    ...orpc.server.channels.queryOptions({
      input: { serverId: selectedServerId || "" },
    }),
    enabled: open && !!selectedServerId,
  });

  const connectMutation = useMutation(
    orpc.hubDiscovery.quickConnect.mutationOptions({
      onSuccess: () => {
        message.success(`Successfully bridged to ${hub?.metadata.name}!`);
        queryClient.invalidateQueries({
          queryKey: orpc.hubDiscovery.key(),
        });
        handleClose();
      },
      onError: (error: any) => {
        message.error(error.message || "Failed to create hub bridge connection.");
      },
    })
  );

  const handleClose = () => {
    setSelectedServerId(undefined);
    setSelectedChannelId(undefined);
    setInviteCode("");
    onCancel();
  };

  const handleConnect = () => {
    if (!hub || !selectedServerId || !selectedChannelId) return;
    connectMutation.mutate({
      hubId: hub.metadata.id,
      serverId: selectedServerId,
      channelId: selectedChannelId,
      inviteCode: inviteCode.trim() || undefined,
    });
  };

  const isFormValid = !!selectedServerId && !!selectedChannelId;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      title={
        <div className="flex items-center gap-2 text-white font-['Sora']">
          <ClusterOutlined className="text-violet-400" />
          <span>Connect to {hub?.metadata.name}</span>
        </div>
      }
      className="dashboard-glass-modal"
      styles={{
        body: {
          padding: 16,
          background: "rgba(20, 20, 28, 0.95)",
          borderRadius: 20,
          color: "white",
        },
        mask: {
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <div className="flex flex-col gap-4 py-4 text-xs">
        <p className="text-white/60">
          Bridge a channel from one of your Discord servers into this hub. Messages sent in your channel will be broadcasted to all connected servers.
        </p>

        {/* Server Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-white/80 font-semibold">1. Select Server</label>
          <Select
            placeholder="Choose your Discord server"
            loading={isLoadingServers}
            value={selectedServerId}
            onChange={(val) => {
              setSelectedServerId(val);
              setSelectedChannelId(undefined);
            }}
            options={servers.map((s) => ({
              value: s.metadata.id,
              label: s.metadata.name,
            }))}
            className="w-full"
          />
        </div>

        {/* Channel Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-white/80 font-semibold">2. Select Channel</label>
          <Select
            placeholder={selectedServerId ? "Choose text channel" : "Select a server first"}
            disabled={!selectedServerId}
            loading={isLoadingChannels}
            value={selectedChannelId}
            onChange={(val) => setSelectedChannelId(val)}
            options={channels.map((c) => ({
              value: c.id,
              label: `#${c.name}`,
            }))}
            className="w-full"
          />
        </div>

        {/* Invite Code (Optional) */}
        {hub?.spec.visibility === "PRIVATE" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-white/80 font-semibold">3. Invite Code (Required for Private Hubs)</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="e.g. HUB-INVITE-CODE"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-violet-500/50 text-white text-xs outline-none transition-colors"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08] mt-2">
          <button
            type="button"
            onClick={handleClose}
            className="dashboard-btn-secondary px-4 py-2 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isFormValid || connectMutation.isPending}
            onClick={handleConnect}
            className="dashboard-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <LinkOutlined />
            <span>{connectMutation.isPending ? "Connecting..." : "Confirm Bridge"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
