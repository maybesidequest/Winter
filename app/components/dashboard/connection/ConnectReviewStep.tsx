import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import type { HubResource } from "~/resources/hub";
import type { DiscordChannelResource } from "~/resources/server";
import { channelGlyph } from "./channelMeta";
import { DiscordGlyph } from "./DiscordGlyph";

interface ConnectReviewStepProps {
  selectedHub: HubResource;
  selectedChannel: DiscordChannelResource;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string | null;
  onResetMutation: () => void;
  onBack: () => void;
  onCreateBridge: () => void;
}

export function ConnectReviewStep({
  selectedHub,
  selectedChannel,
  isPending,
  isError,
  errorMessage,
  onResetMutation,
  onBack,
  onCreateBridge,
}: ConnectReviewStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#211f35] border border-white/10 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#8175ee] shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-white truncate">{selectedHub.metadata.name}</span>
          </span>
          <span className="flex-1 border-t border-dashed border-violet-400/40" aria-hidden="true" />
          <span
            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-violet-500/15 border border-violet-400/30 text-violet-300 shrink-0"
            title="Discord Bridge Relay"
            aria-label="Discord Bridge Relay"
          >
            <DiscordGlyph className="w-4 h-4" />
          </span>
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

      {isPending ? (
        <p className="flex items-center gap-2 text-xs text-sky-200 m-0" role="status">
          <LoadingOutlined /> Creating the bridge…
        </p>
      ) : (
        isError && (
          <div className="p-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06]">
            <p className="text-xs text-amber-100 m-0" role="alert">
              {errorMessage || "This connection could not be created."}
            </p>
            <button
              type="button"
              onClick={onResetMutation}
              className="text-xs text-amber-200 underline mt-1.5 cursor-pointer inline-flex items-center gap-1.5"
            >
              <ReloadOutlined /> Try again
            </button>
          </div>
        )
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onCreateBridge}
          disabled={isPending}
          className="dashboard-btn-primary px-4 py-2 text-xs font-semibold"
        >
          Create bridge
        </button>
      </div>
    </div>
  );
}

