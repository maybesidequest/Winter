export const CHANNEL_TYPE_META: Record<number, { label: string; glyph: string }> = {
  0: { label: "Text", glyph: "#" },
  5: { label: "Announcement", glyph: "#" },
  15: { label: "Forum", glyph: "⌗" },
  2: { label: "Voice", glyph: "🔈" },
};

export function channelGlyph(type: number): string {
  return CHANNEL_TYPE_META[type]?.glyph ?? "#";
}

export function channelTypeLabel(type: number): string {
  return CHANNEL_TYPE_META[type]?.label ?? "Text";
}

