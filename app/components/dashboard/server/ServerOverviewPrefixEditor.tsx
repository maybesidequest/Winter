import { CheckOutlined, SaveOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { orpcClient as orpc } from "~/lib/orpc";
import type { ServerResource } from "~/resources/server";

export interface ServerOverviewPrefixEditorProps {
  server: ServerResource;
  onServerUpdated?: () => void;
}

export function ServerOverviewPrefixEditor({ server, onServerUpdated }: ServerOverviewPrefixEditorProps) {
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

  const isDirty = prefix.trim() !== savedPrefix && prefix.trim().length > 0;

  const handleSave = async () => {
    const trimmed = prefix.trim();
    if (!trimmed || trimmed.length > 10) {
      message.error("Prefix must be between 1 and 10 characters.");
      return;
    }
    if (!server.version) {
      message.error("Server version is unavailable. Refresh before saving.");
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
      setTimeout(() => setJustSaved(false), 2500);
      message.success(`Command prefix updated to "${nextPrefix}"`);
      onServerUpdated?.();
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Failed to save command prefix.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] shadow-[0_2px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-white/80">Command Prefix</span>
        <span className="text-xs text-white/60 font-mono">Example: <code className="text-violet-300">{prefix || "!"}call</code></span>
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

      <p className="text-xs text-white/70 m-0">
        Trigger for text commands in Discord. Slash commands (<code>/</code>) remain active alongside your prefix.
      </p>
    </div>
  );
}
