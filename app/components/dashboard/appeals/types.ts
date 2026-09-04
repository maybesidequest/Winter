export interface SubmittedAppealRecord {
  infractionId: string;
  hubId: string;
  hubName?: string;
  sanctionType: string;
  originalReason: string;
  appealReason: string;
  submittedAt: string;
}

const STORAGE_KEY = "interchat:submitted_appeals:v1";

export function getStoredSubmittedAppeals(): SubmittedAppealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredSubmittedAppeal(record: SubmittedAppealRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredSubmittedAppeals();
    const updated = [record, ...current.filter((item) => item.infractionId !== record.infractionId)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota or disabled localStorage exceptions
  }
}

