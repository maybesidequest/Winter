import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

interface HelpTopic {
  id: string;
  title: string;
  body: string;
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: "hubs",
    title: "Managing a Hub",
    body: "Open any Hub from your sidebar or Hubs page to update its branding, moderation rules, relay modules, invite codes, staff roles, announcements, and audit history.",
  },
  {
    id: "servers",
    title: "Connecting a Discord server",
    body: "Channel connections link a text channel in your server to a Hub relay. Use the /hub connect command or invite code in Discord, then manage connection status in the dashboard.",
  },
  {
    id: "privacy",
    title: "Keeping your account private",
    body: "Your profile and dashboard preferences are strictly self-scoped. Private Hub details and administrative controls are visible only to verified managers.",
  },
  {
    id: "versions",
    title: "Saving changes & optimistic locking",
    body: "Configuration changes use optimistic concurrency versions. If another manager edits the same setting at the same time, refresh to review the latest state before saving.",
  },
];

export function HelpTopicsSearch() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return HELP_TOPICS;
    return HELP_TOPICS.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.body.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div
      className="rounded-2xl p-6 border flex flex-col gap-5"
      style={dashboardGlassCardStyle}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-white/65 m-0 mt-0.5">
            Quick guides on configuring Hubs, linking channels, and managing permissions.
          </p>
        </div>

        <div className="relative sm:w-72">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs" />
          <input
            type="text"
            aria-label="Search help topics"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics (e.g. Hubs, privacy)…"
            className="dashboard-input text-xs pl-8 py-1.5 min-h-[36px] w-full"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center gap-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <InfoCircleOutlined className="text-xl text-white/40" />
          <p className="text-xs text-white/65 m-0">No help topics match "{search}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-1.5"
            >
              <h4 className="text-xs font-bold text-white font-['Sora'] m-0 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8175ee]" />
                <span>{topic.title}</span>
              </h4>
              <p className="text-xs text-white/70 m-0 leading-relaxed">
                {topic.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

