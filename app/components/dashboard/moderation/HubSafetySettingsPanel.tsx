import { useEffect, useState } from "react";
import type { HubSafetySettings } from "~/services/control/moderation";

const FIELDS: Array<{ key: keyof HubSafetySettings["spec"]; label: string }> = [
  { key: "hideLinks", label: "Hide links" }, { key: "spamFilter", label: "Spam filter" }, { key: "blockInvites", label: "Block Discord invites" }, { key: "blockNsfw", label: "Block NSFW content" }, { key: "allowVideos", label: "Allow videos" }, { key: "blockAttachments", label: "Block attachments" }, { key: "blockTenorGifs", label: "Block Tenor GIFs" },
];
export function HubSafetySettingsPanel({ settings, canEdit, saving, onSave }: { settings: HubSafetySettings; canEdit: boolean; saving?: boolean; onSave: (settings: Partial<HubSafetySettings["spec"]>, updateMask: Array<keyof HubSafetySettings["spec"]>, expectedVersion: number) => void }) {
  const [draft, setDraft] = useState(settings.spec);
  useEffect(() => setDraft(settings.spec), [settings]);
  const changed = FIELDS.filter(({ key }) => draft[key] !== settings.spec[key]).map(({ key }) => key);
  return <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4"><div className="mb-3 flex flex-wrap justify-between gap-2"><strong className="text-sm text-white">Hub safety settings</strong><span className="text-xs text-white/50">Last updated: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : "Not observed"}</span></div><div className="grid gap-3 sm:grid-cols-2">{FIELDS.map(({ key, label }) => <label key={key} className="flex items-center justify-between gap-3 text-xs text-white/75"><span>{label}</span><input type="checkbox" checked={draft[key]} disabled={!canEdit || saving} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.checked }))} /></label>)}</div>{canEdit && <button type="button" className="dashboard-btn-primary mt-4 px-3 py-1.5 text-xs" disabled={saving || changed.length === 0} onClick={() => onSave(draft, changed, settings.version)}>{saving ? "Saving…" : "Save safety settings"}</button>}</section>;
}
