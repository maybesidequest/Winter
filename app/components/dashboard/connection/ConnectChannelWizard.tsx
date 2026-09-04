import {
  CheckCircleFilled,
  LinkOutlined,
  LoadingOutlined,
  ReloadOutlined,
  RightOutlined,
  SlackOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Modal } from "antd";
import { useMemo, useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { DiscordChannelResource, ServerResource } from "~/resources/server";

interface ConnectChannelWizardProps {
  server: ServerResource;
  channels: DiscordChannelResource[];
  open: boolean;
  onClose: () => void;
  onConnected?: () => void;
}

type Step = "prerequisites" | "choose" | "review" | "done";

const STEPS: { key: Step; label: string }[] = [
  { key: "prerequisites", label: "Check" },
  { key: "choose", label: "Connect" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

const CHANNEL_TYPE_META: Record<number, { label: string; glyph: string }> = {
  0: { label: "Text", glyph: "#" },
  5: { label: "Announcement", glyph: "#" },
  15: { label: "Forum", glyph: "⌗" },
  2: { label: "Voice", glyph: "🔈" },
};

function channelGlyph(type: number): string {
  return CHANNEL_TYPE_META[type]?.glyph ?? "#";
}

function channelTypeLabel(type: number): string {
  return CHANNEL_TYPE_META[type]?.label ?? "Text";
}

function StepRail({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);
  return (
    <ol className="flex items-center gap-1.5 m-0 mb-5 p-0 list-none" aria-label="Connection steps">
      {STEPS.map((step, index) => {
        const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
        return (
          <li key={step.key} className="flex items-center gap-1.5" aria-current={state === "current" ? "step" : undefined}>
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold border transition-colors ${
                state === "done"
                  ? "bg-emerald-400/15 border-emerald-400/40 text-emerald-300"
                  : state === "current"
                    ? "bg-violet-500/20 border-violet-400/60 text-violet-200"
                    : "bg-white/[0.04] border-white/10 text-white/40"
              }`}
            >
              {state === "done" ? <CheckCircleFilled /> : index + 1}
            </span>
            <span
              className={`text-[11px] font-semibold tracking-wide ${
                state === "current" ? "text-white" : state === "done" ? "text-white/60" : "text-white/40"
              }`}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && <span className="w-4 h-px bg-white/15 mx-1" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
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
  const alreadyBridged = new Set(
    channels.filter((channel) => !channel.connectable && channel.rejectionReason?.toLowerCase().includes("already")).map((channel) => channel.id),
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
    // A completed connection should not be lost to a re-opened wizard.
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

  const prerequisiteRows = [
    {
      ok: connectableChannels.length > 0,
      title: `${connectableChannels.length} connectable ${connectableChannels.length === 1 ? "channel" : "channels"}`,
      detail:
        connectableChannels.length > 0
          ? "Text, announcement, and forum channels the bot can relay from."
          : "No channel in this server can be bridged. Check that the bot is in the server and can view the channel.",
    },
    {
      ok: rejectedChannels.length === 0,
      title: rejectedChannels.length === 0 ? "No channel conflicts" : `${rejectedChannels.length} unavailable ${rejectedChannels.length === 1 ? "channel" : "channels"}`,
      detail:
        rejectedChannels.length === 0
          ? "Every channel is available to bridge."
          : rejectedChannels
              .slice(0, 3)
              .map((channel) => `#${channel.name}: ${channel.rejectionReason}`)
              .join(" · "),
    },
  ];

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
        <div className="flex flex-col gap-4">
          <p className="text-sm text-white/70 m-0 leading-relaxed">
            Bridging relays messages between <strong className="text-white">{server.metadata.name}</strong> and a Hub&apos;s
            network. Check the server is ready before choosing a channel.
          </p>
          <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
            {prerequisiteRows.map((row) => (
              <li
                key={row.title}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  row.ok ? "border-emerald-400/20 bg-emerald-400/[0.06]" : "border-amber-400/25 bg-amber-400/[0.06]"
                }`}
              >
                <span className={`mt-0.5 text-sm ${row.ok ? "text-emerald-300" : "text-amber-300"}`}>
                  {row.ok ? <CheckCircleFilled /> : <WarningFilled />}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{row.title}</span>
                  <span className="block text-xs text-white/60 mt-0.5">{row.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3 mt-1">
            <button type="button" onClick={handleClose} className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep("choose")}
              disabled={connectableChannels.length === 0}
              className="dashboard-btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Continue</span>
              <RightOutlined className="text-[11px]" />
            </button>
          </div>
        </div>
      )}

      {step === "choose" && (
        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2 m-0 p-0 border-0">
            <legend className="text-xs font-bold tracking-wide text-white/70 m-0 mb-1.5">1 · Choose the Hub</legend>
            {hubsQuery.isLoading && (
              <p className="flex items-center gap-2 text-xs text-white/60 m-0" role="status">
                <LoadingOutlined /> Loading your Hubs…
              </p>
            )}
            {hubsQuery.isError && (
              <p className="text-xs text-amber-200 m-0" role="alert">
                Your Hubs could not be loaded.{" "}
                <button type="button" onClick={() => void hubsQuery.refetch()} className="underline cursor-pointer">
                  Retry
                </button>
              </p>
            )}
            {hubsQuery.isSuccess && manageableHubs.length === 0 && (
              <p className="text-xs text-white/60 m-0">
                You do not manage connections on any Hub. Ask a Hub owner for the{" "}
                <strong className="text-white/85">Manage connections</strong> permission, or{" "}
                <a href="/dashboard/hubs" className="text-violet-300 underline">
                  create your own Hub
                </a>
                .
              </p>
            )}
            {manageableHubs.length > 0 && (
              <ul className="flex flex-col gap-1.5 m-0 p-0 list-none max-h-44 overflow-y-auto pr-0.5">
                {manageableHubs.map((hub) => {
                  const active = hub.metadata.id === selectedHubId;
                  return (
                    <li key={hub.metadata.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedHubId(hub.metadata.id)}
                        aria-pressed={active}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border text-left transition-colors ${
                          active
                            ? "border-violet-400/60 bg-violet-500/15"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          {hub.spec.iconUrl ? (
                            <img src={hub.spec.iconUrl} alt="" className="w-6 h-6 rounded-lg object-cover" />
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.06] text-[11px] font-bold text-white/70">
                              {hub.metadata.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-white truncate">{hub.metadata.name}</span>
                        </span>
                        <span className="text-[11px] text-white/50 shrink-0">
                          {hub.status.connectionCount} {hub.status.connectionCount === 1 ? "bridge" : "bridges"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </fieldset>

          <fieldset className="flex flex-col gap-2 m-0 p-0 border-0" disabled={!selectedHubId}>
            <legend className="text-xs font-bold tracking-wide text-white/70 m-0 mb-1.5">2 · Choose the channel</legend>
            {connectableChannels.length > 8 && (
              <input
                type="text"
                placeholder="Search channels…"
                value={channelQuery}
                onChange={(event) => setChannelQuery(event.target.value)}
                className="dashboard-input text-xs w-full"
              />
            )}
            <ul className="flex flex-col gap-1.5 m-0 p-0 list-none max-h-52 overflow-y-auto pr-0.5">
              {filteredChannels.map((channel) => {
                const active = channel.id === selectedChannelId;
                const bridged = alreadyBridged.has(channel.id);
                return (
                  <li key={channel.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedChannelId(channel.id)}
                      aria-pressed={active}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border text-left transition-colors ${
                        active
                          ? "border-violet-400/60 bg-violet-500/15"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="text-white/40 text-xs w-4 text-center" aria-hidden="true">
                          {channelGlyph(channel.type)}
                        </span>
                        <span className="text-sm text-white truncate">{channel.name}</span>
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        {bridged && <span className="text-[11px] font-bold tracking-wide text-white/50 uppercase">Bridged</span>}
                        <span className="text-[11px] text-white/40">{channelTypeLabel(channel.type)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
              {filteredChannels.length === 0 && (
                <li className="text-xs text-white/50 px-1 py-2">No channels match “{channelQuery}”.</li>
              )}
            </ul>
          </fieldset>

          {connectMutation.isError && (
            <p className="text-xs text-amber-200 m-0" role="alert">
              {connectMutation.error instanceof Error ? connectMutation.error.message : "This connection could not be created."}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setStep("prerequisites")} className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold">
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep("review")}
              disabled={!selectedHubId || !selectedChannelId}
              className="dashboard-btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Review</span>
              <RightOutlined className="text-[11px]" />
            </button>
          </div>
        </div>
      )}

      {step === "review" && selectedHub && selectedChannel && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#211f35] border border-white/10 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#8175ee] shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-white truncate">{selectedHub.metadata.name}</span>
              </span>
              <span className="flex-1 border-t border-dashed border-violet-400/40" aria-hidden="true" />
              <SlackOutlined className="text-violet-300 shrink-0" aria-hidden="true" />
              <span className="flex-1 border-t border-dashed border-violet-400/40" aria-hidden="true" />
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#211f35] border border-white/10 min-w-0">
                <span className="text-white/40 text-xs" aria-hidden="true">
                  {channelGlyph(selectedChannel.type)}
                </span>
                <span className="text-sm font-semibold text-white truncate">#{selectedChannel.name}</span>
              </span>
            </div>
            <p className="text-xs text-white/60 m-0 mt-3 leading-relaxed">
              Messages in <strong className="text-white/85">#{selectedChannel.name}</strong> will relay across{" "}
              <strong className="text-white/85">{selectedHub.metadata.name}</strong>&apos;s network. You can pause or
              disconnect this bridge at any time from this page.
            </p>
          </div>
          {connectMutation.isPending ? (
            <p className="flex items-center gap-2 text-xs text-sky-200 m-0" role="status">
              <LoadingOutlined /> Creating the bridge…
            </p>
          ) : (
            connectMutation.isError && (
              <div className="p-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06]">
                <p className="text-xs text-amber-100 m-0" role="alert">
                  {connectMutation.error instanceof Error
                    ? connectMutation.error.message
                    : "This connection could not be created."}
                </p>
                <button
                  type="button"
                  onClick={() => connectMutation.reset()}
                  className="text-xs text-amber-200 underline mt-1.5 cursor-pointer"
                >
                  <ReloadOutlined /> Try again
                </button>
              </div>
            )
          )}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep("choose")}
              disabled={connectMutation.isPending}
              className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() =>
                connectMutation.mutate({
                  hubId: selectedHub.metadata.id,
                  channelId: selectedChannel.id,
                  serverId: server.metadata.id,
                  idempotencyKey: idempotencyKeyRef.current,
                })
              }
              disabled={connectMutation.isPending}
              className="dashboard-btn-primary px-4 py-2 text-xs font-semibold"
            >
              Create bridge
            </button>
          </div>
        </div>
      )}

      {step === "done" && selectedHub && selectedChannel && (
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-400/12 border border-emerald-400/30 text-emerald-300 text-xl">
            <CheckCircleFilled />
          </span>
          <h3 className="font-['Sora'] text-base font-bold text-white m-0">
            #{selectedChannel.name} is bridged to {selectedHub.metadata.name}
          </h3>
          <p className="text-xs text-white/60 max-w-sm leading-relaxed">
            The bridge appears in this server&apos;s bridge list below. If relaying has not started after a minute, use
            the bridge&apos;s repair action.
          </p>
          <div className="flex items-center gap-2.5 mt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedChannelId(null);
                setStep("choose");
                idempotencyKeyRef.current = crypto.randomUUID();
              }}
              className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold"
            >
              Connect another channel
            </button>
            <button type="button" onClick={reset} className="dashboard-btn-primary px-4 py-2 text-xs font-semibold">
              Finish
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
