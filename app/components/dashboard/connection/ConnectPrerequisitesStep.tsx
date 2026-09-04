import { CheckCircleFilled, RightOutlined, WarningFilled } from "@ant-design/icons";
import type { DiscordChannelResource, ServerResource } from "~/resources/server";

interface ConnectPrerequisitesStepProps {
  server: ServerResource;
  connectableChannels: DiscordChannelResource[];
  rejectedChannels: DiscordChannelResource[];
  onCancel: () => void;
  onContinue: () => void;
}

export function ConnectPrerequisitesStep({
  server,
  connectableChannels,
  rejectedChannels,
  onCancel,
  onContinue,
}: ConnectPrerequisitesStepProps) {
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
      title:
        rejectedChannels.length === 0
          ? "No channel conflicts"
          : `${rejectedChannels.length} unavailable ${rejectedChannels.length === 1 ? "channel" : "channels"}`,
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
        <button type="button" onClick={onCancel} className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold">
          Cancel
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={connectableChannels.length === 0}
          className="dashboard-btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
        >
          <span>Continue</span>
          <RightOutlined className="text-xs" />
        </button>
      </div>
    </div>
  );
}

