import { LinkOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Modal } from "antd";
import { useMemo, useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { DiscordChannelResource, ServerResource } from "~/resources/server";
import { ConnectChooseStep } from "./ConnectChooseStep";
import { ConnectDoneStep } from "./ConnectDoneStep";
import { ConnectPrerequisitesStep } from "./ConnectPrerequisitesStep";
import { ConnectReviewStep } from "./ConnectReviewStep";
import { StepRail, type Step } from "./StepRail";

interface ConnectChannelWizardProps {
  server: ServerResource;
  channels: DiscordChannelResource[];
  open: boolean;
  onClose: () => void;
  onConnected?: () => void;
}

export function ConnectChannelWizard({ server, channels, open, onClose, onConnected }: ConnectChannelWizardProps) {
  const [step, setStep] = useState<Step>("prerequisites");
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [channelQuery, setChannelQuery] = useState("");
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const connectableChannels = useMemo(
    () => channels.filter((channel) => channel.connectable),
    [channels],
  );
  const rejectedChannels = useMemo(
    () => channels.filter((channel) => !channel.connectable && channel.rejectionReason),
    [channels],
  );

  const hubsQuery = useQuery({
    ...orpc.hub.getUserHubs.queryOptions({ input: undefined }),
    enabled: open && (step === "choose" || step === "review"),
    staleTime: 30_000,
  });

  const manageableHubs = useMemo(() => {
    const hubs = hubsQuery.data ?? [];
    return hubs.filter((hub) => hub.metadata.permissions?.MANAGE_CONNECTIONS !== false);
  }, [hubsQuery.data]);

  const selectedHub = manageableHubs.find((hub) => hub.metadata.id === selectedHubId) ?? null;
  const selectedChannel = connectableChannels.find((channel) => channel.id === selectedChannelId) ?? null;
  const alreadyBridged = useMemo(
    () =>
      new Set(
        channels
          .filter((channel) => !channel.connectable && channel.rejectionReason?.toLowerCase().includes("already"))
          .map((channel) => channel.id),
      ),
    [channels],
  );

  const filteredChannels = useMemo(() => {
    const query = channelQuery.trim().toLowerCase();
    if (!query) return connectableChannels;
    return connectableChannels.filter((channel) => channel.name.toLowerCase().includes(query));
  }, [connectableChannels, channelQuery]);

  const reset = () => {
    setStep("prerequisites");
    setSelectedHubId(null);
    setSelectedChannelId(null);
    setChannelQuery("");
    idempotencyKeyRef.current = crypto.randomUUID();
  };

  const handleClose = () => {
    onClose();
    if (step === "done") reset();
  };

  const connectMutation = useMutation(
    orpc.hub.createConnection.mutationOptions({
      onSuccess: () => {
        setStep("done");
        onConnected?.();
      },
    }),
  );

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={560}
      centered
      title={
        <span className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-400/30 text-violet-300">
            <LinkOutlined />
          </span>
          <span className="font-['Sora'] text-sm font-bold text-white">Connect a channel to a Hub</span>
        </span>
      }
      styles={{
        root: { background: "#13141f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 },
        header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12, marginBottom: 0 },
        body: { paddingTop: 20 },
      }}
    >
      <StepRail current={step} />

      {step === "prerequisites" && (
        <ConnectPrerequisitesStep
          server={server}
          connectableChannels={connectableChannels}
          rejectedChannels={rejectedChannels}
          onCancel={handleClose}
          onContinue={() => setStep("choose")}
        />
      )}

      {step === "choose" && (
        <ConnectChooseStep
          isLoadingHubs={hubsQuery.isLoading}
          isHubsError={hubsQuery.isError}
          onRetryHubs={() => void hubsQuery.refetch()}
          hubsLoaded={hubsQuery.isSuccess}
          manageableHubs={manageableHubs}
          selectedHubId={selectedHubId}
          onSelectHubId={setSelectedHubId}
          connectableChannels={connectableChannels}
          filteredChannels={filteredChannels}
          alreadyBridged={alreadyBridged}
          selectedChannelId={selectedChannelId}
          onSelectChannelId={setSelectedChannelId}
          channelQuery={channelQuery}
          onChannelQueryChange={setChannelQuery}
          errorMessage={
            connectMutation.isError
              ? connectMutation.error instanceof Error
                ? connectMutation.error.message
                : "This connection could not be created."
              : null
          }
          onBack={() => setStep("prerequisites")}
          onReview={() => setStep("review")}
        />
      )}

      {step === "review" && selectedHub && selectedChannel && (
        <ConnectReviewStep
          selectedHub={selectedHub}
          selectedChannel={selectedChannel}
          isPending={connectMutation.isPending}
          isError={connectMutation.isError}
          errorMessage={
            connectMutation.error instanceof Error
              ? connectMutation.error.message
              : "This connection could not be created."
          }
          onResetMutation={() => connectMutation.reset()}
          onBack={() => setStep("choose")}
          onCreateBridge={() =>
            connectMutation.mutate({
              hubId: selectedHub.metadata.id,
              channelId: selectedChannel.id,
              serverId: server.metadata.id,
              idempotencyKey: idempotencyKeyRef.current,
            })
          }
        />
      )}

      {step === "done" && selectedHub && selectedChannel && (
        <ConnectDoneStep
          selectedHub={selectedHub}
          selectedChannel={selectedChannel}
          onConnectAnother={() => {
            setSelectedChannelId(null);
            setStep("choose");
            idempotencyKeyRef.current = crypto.randomUUID();
          }}
          onFinish={reset}
        />
      )}
    </Modal>
  );
}
