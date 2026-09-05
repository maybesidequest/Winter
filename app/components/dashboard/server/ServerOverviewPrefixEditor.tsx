import { CheckOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { orpcClient as orpc } from "~/lib/orpc";
import type { ServerResource } from "~/resources/server";
import type { User } from "~/services/auth.server";

export interface ServerOverviewPrefixEditorProps {
  server: ServerResource;
  user?: User;
  onServerUpdated?: () => void;
}

export function ServerOverviewPrefixEditor({ server, user, onServerUpdated }: ServerOverviewPrefixEditorProps) {
  const isInstalled = server.status.botInstalled;
  const [prefix, setPrefix] = useState(server.spec.prefix || "!");
  const [savedPrefix, setSavedPrefix] = useState(server.spec.prefix || "!");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  useEffect(() => {
    setPrefix(server.spec.prefix || "!");
    setSavedPrefix(server.spec.prefix || "!");
  }, [server.spec.prefix]);

  const effectivePrefix = prefix.trim() || "!";
  const isDirty = prefix.trim() !== savedPrefix && prefix.trim().length > 0;

  const handleSave = async () => {
    const trimmed = prefix.trim();
    if (!trimmed || trimmed.length > 10) {
      message.error("Prefix must be between 1 and 10 characters.");
      return;
    }
    if (!server.version) {
      message.error("Could not reach Discord to verify your server. Please refresh and try again.");
      return;
    }
    setSaving(true);
    try {
      const result = await orpc.server.patchPrefix({
        serverId: server.metadata.id,
        prefix: trimmed,
        expectedVersion: server.version,
        idempotencyKey: idempotencyKeyRef.current,
      });
      const nextPrefix = result.server?.spec.prefix || trimmed;
      setPrefix(nextPrefix);
      setSavedPrefix(nextPrefix);
      idempotencyKeyRef.current = crypto.randomUUID();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
      message.success(`Command prefix updated to "${nextPrefix}". Try running ${nextPrefix}call in Discord!`);
      onServerUpdated?.();
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Failed to save command prefix.");
    } finally {
      setSaving(false);
    }
  };

  const username = user?.username || "You";
  const userAvatarUrl = user?.avatarUrl;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] shadow-[0_2px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 m-0">Bot Command Prefix</h3>
        <span className="text-xs text-white/50">Slash commands (<code>/call</code>) always work</span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <input
          aria-label="Command prefix"
          value={prefix}
          maxLength={10}
          disabled={!isInstalled || saving}
          onChange={(e) => setPrefix(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isDirty && void handleSave()}
          placeholder="!"
          className="w-24 min-h-[44px] text-2xl font-black font-mono text-center text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 outline-none transition-all"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={!isInstalled || !isDirty || saving}
          className={`dashboard-btn-primary px-4 py-2 min-h-[44px] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
            !isDirty ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? (
            <span>Saving…</span>
          ) : justSaved ? (
            <>
              <CheckOutlined className="text-emerald-300" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <SaveOutlined />
              <span>Save Prefix</span>
            </>
          )}
        </button>

        {isDirty && (
          <button
            type="button"
            onClick={() => setPrefix(savedPrefix)}
            disabled={saving}
            className="dashboard-btn-secondary px-3 py-2 min-h-[44px] text-xs cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Interactive Discord Chat Simulator for Instant Clarity & Delight */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex flex-col gap-3 text-xs">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Discord Preview
        </span>

        {/* User Command Message */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5b4ccb] border border-white/10 flex items-center justify-center text-white text-sm font-bold font-['Sora'] overflow-hidden flex-shrink-0 mt-0.5 shadow-sm">
            {userAvatarUrl ? (
              <img src={userAvatarUrl} alt={username} className="w-full h-full object-cover" />
            ) : username ? (
              <span>{username.charAt(0).toUpperCase()}</span>
            ) : (
              <UserOutlined className="text-white/80" />
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white/90 truncate">{username}</span>
              <span className="text-xs text-white/40">Today at 12:42 PM</span>
            </div>
            <p className="text-white font-mono m-0 text-sm">
              <span className="text-violet-300 font-bold">{effectivePrefix}</span>call
            </p>
          </div>
        </div>

        {/* Bot Response Message */}
        <div className="flex items-start gap-3 pl-2 border-l-2 border-violet-500/40 ml-3">
          <div className="w-10 h-10 rounded-full bg-black border border-white/15 flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5 shadow-sm p-1">
            <img src="/images/interchat.png" alt="InterChat" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-violet-200">InterChat</span>
              <span className="bg-[#5865f2] text-xs font-bold text-white px-1.5 py-0.5 rounded leading-none inline-flex items-center gap-1 shadow-sm">
                <CheckOutlined className="text-xs" />
                <span>APP</span>
              </span>
            </div>
            <p className="text-white/80 m-0 leading-relaxed text-xs">
              {justSaved ? (
                <span className="text-emerald-300 font-semibold">
                  ✨ Command prefix updated! Running {effectivePrefix}call is now active.
                </span>
              ) : (
                <>Searching for an active server to chat with… Found a match!</>
              )}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/60 m-0">
        Type the symbol your community prefers for text commands.
      </p>
    </div>
  );
}
