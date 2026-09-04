import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import type { HubResource } from "~/resources/hub";
import type { DiscordChannelResource } from "~/resources/server";
import { channelGlyph, channelTypeLabel } from "./channelMeta";

interface ConnectChooseStepProps {
  isLoadingHubs: boolean;
  isHubsError: boolean;
  onRetryHubs: () => void;
  hubsLoaded: boolean;
  manageableHubs: HubResource[];
  selectedHubId: string | null;
  onSelectHubId: (id: string) => void;
  connectableChannels: DiscordChannelResource[];
  filteredChannels: DiscordChannelResource[];
  alreadyBridged: Set<string>;
  selectedChannelId: string | null;
  onSelectChannelId: (id: string) => void;
  channelQuery: string;
  onChannelQueryChange: (val: string) => void;
  errorMessage?: string | null;
  onBack: () => void;
  onReview: () => void;
}

export function ConnectChooseStep({
  isLoadingHubs,
  isHubsError,
  onRetryHubs,
  hubsLoaded,
  manageableHubs,
  selectedHubId,
  onSelectHubId,
  connectableChannels,
  filteredChannels,
  alreadyBridged,
  selectedChannelId,
  onSelectChannelId,
  channelQuery,
  onChannelQueryChange,
  errorMessage,
  onBack,
  onReview,
}: ConnectChooseStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2 m-0 p-0 border-0">
        <legend className="text-xs font-bold tracking-wide text-white/70 m-0 mb-1.5">1 · Choose the Hub</legend>
        {isLoadingHubs && (
          <p className="flex items-center gap-2 text-xs text-white/60 m-0" role="status">
            <LoadingOutlined /> Loading your Hubs…
          </p>
        )}
        {isHubsError && (
          <p className="text-xs text-amber-200 m-0" role="alert">
            Your Hubs could not be loaded.{" "}
            <button type="button" onClick={onRetryHubs} className="underline cursor-pointer">
              Retry
            </button>
          </p>
        )}
        {hubsLoaded && manageableHubs.length === 0 && (
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
                    onClick={() => onSelectHubId(hub.metadata.id)}
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
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.06] text-xs font-bold text-white/70">
                          {hub.metadata.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-white truncate">{hub.metadata.name}</span>
                    </span>
                    <span className="text-xs text-white/50 shrink-0">
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
            onChange={(event) => onChannelQueryChange(event.target.value)}
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
                  onClick={() => onSelectChannelId(channel.id)}
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
                    {bridged && <span className="text-xs font-bold tracking-wide text-white/50 uppercase">Bridged</span>}
                    <span className="text-xs text-white/40">{channelTypeLabel(channel.type)}</span>
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

      {errorMessage && (
        <p className="text-xs text-amber-200 m-0" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold">
          Back
        </button>
        <button
          type="button"
          onClick={onReview}
          disabled={!selectedHubId || !selectedChannelId}
          className="dashboard-btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
        >
          <span>Review</span>
          <RightOutlined className="text-xs" />
        </button>
      </div>
    </div>
  );
}

