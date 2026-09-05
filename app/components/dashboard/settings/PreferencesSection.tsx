import { message } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { DashboardSelect, DepthToggle } from "~/components/dashboard/shared";
import type { UserResource, SupportedLocale } from "~/resources/user";
import { orpc } from "~/lib/orpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatchUserPreferencesInput } from "~/schemas/user";

interface PreferencesSectionProps {
  userResource?: UserResource;
  locales: SupportedLocale[];
  isLoading?: boolean;
}

export function PreferencesSection({
  userResource,
  locales,
  isLoading,
}: PreferencesSectionProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    orpc.user.patchPreferences.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.user.get.queryOptions().queryKey });
      },
      onError: (error) => message.error(error.message || "Preferences could not be saved."),
    })
  );

  if (isLoading || !userResource) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-white/5 border border-white/10" />
        ))}
      </div>
    );
  }

  const { spec } = userResource;

  const handleToggle = (key: keyof PatchUserPreferencesInput, value: string | boolean) => {
    mutation.mutate({ [key]: value });
  };

  const prefRows = [
    {
      id: "showBadges",
      title: "Display Badges on Messages",
      desc: "Show your earned badges (Owner, Staff, Streaks) when you chat across Hubs.",
      checked: spec.showBadges,
      onChange: (checked: boolean) => handleToggle("showBadges", checked),
    },
    {
      id: "mentionOnReply",
      title: "Mention on Message Reply",
      desc: "Receive a Discord notification ping when another user replies to your broadcasted message.",
      checked: spec.mentionOnReply,
      onChange: (checked: boolean) => handleToggle("mentionOnReply", checked),
    },
    {
      id: "voteRemindersEnabled",
      title: "Vote Reminders",
      desc: "Receive friendly reminder notifications when your 12-hour Top.gg bot vote is ready.",
      checked: spec.voteRemindersEnabled,
      onChange: (checked: boolean) => handleToggle("voteRemindersEnabled", checked),
      action: (
        <a
          href="https://top.gg/bot/interchat/vote"
          target="_blank"
          rel="noreferrer"
          className="dashboard-pill-btn text-xs flex items-center gap-1.5 py-1 px-2.5 rounded-lg no-underline text-violet-300 hover:text-white"
        >
          <span>Vote</span>
          <LinkOutlined className="text-xs" />
        </a>
      ),
    },
    {
      id: "streaksEnabled",
      title: "Personal Streaks",
      desc: "Count qualifying activity toward streaks, freezes, and milestone badges.",
      checked: spec.streaksEnabled,
      onChange: (checked: boolean) => handleToggle("streaksEnabled", checked),
    },
  ];

  return (
    <div className="relative z-10 flex flex-col gap-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Sora'] tracking-tight">
          Bot & Interaction Preferences
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-0.5">
          Configure how InterChat interacts with you across Discord hubs and server bridges.
        </p>
      </div>

      {/* Language / Locale Card */}
      <div
        className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          background: "#13141f",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.5)",
        }}
      >
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white">Bot Language</h4>
          <p className="text-xs text-white/50">
            Language used for bot commands, embed responses, and direct messages.
          </p>
        </div>
        <div className="w-full sm:w-48">
          <DashboardSelect
            value={spec.locale || "en"}
            onChange={(val) => handleToggle("locale", val)}
            disabled={mutation.isPending}
            className="w-full"
            aria-label="Bot Language"
            options={locales.map((loc) => ({
              value: loc.code,
              label: `${loc.flag} ${loc.name}`,
            }))}
          />
        </div>
      </div>

      {/* Toggle Switches */}
      <div className="flex flex-col gap-2.5">
        {prefRows.map((row) => (
          <div
            key={row.id}
            className="p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3"
            style={{
              background: "#13141f",
              borderColor: "rgba(255, 255, 255, 0.08)",
              boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.4)",
            }}
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                {row.title}
              </span>
              <span className="text-xs text-white/50 mt-0.5 leading-snug">
                {row.desc}
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {row.action}
              <DepthToggle
                checked={row.checked}
                onChange={row.onChange}
                disabled={mutation.isPending}
                aria-label={row.title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
