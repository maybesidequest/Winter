import { CheckCircleFilled } from "@ant-design/icons";
import type { HubResource } from "~/resources/hub";
import type { DiscordChannelResource } from "~/resources/server";

interface ConnectDoneStepProps {
  selectedHub: HubResource;
  selectedChannel: DiscordChannelResource;
  onConnectAnother: () => void;
  onFinish: () => void;
}

export function ConnectDoneStep({
  selectedHub,
  selectedChannel,
  onConnectAnother,
  onFinish,
}: ConnectDoneStepProps) {
  return (
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
          onClick={onConnectAnother}
          className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold"
        >
          Connect another channel
        </button>
        <button type="button" onClick={onFinish} className="dashboard-btn-primary px-4 py-2 text-xs font-semibold">
          Finish
        </button>
      </div>
    </div>
  );
}

