import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function DashboardShortcuts() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [chord, setChord] = useState(false);
  const [searchMissing, setSearchMissing] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      closeRef.current?.focus();
    } else {
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    let chordTimer: ReturnType<typeof setTimeout> | undefined;
    let searchMissingTimer: ReturnType<typeof setTimeout> | undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target instanceof HTMLElement ? event.target : null;
      const isEditing = Boolean(
        element && (
          element.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName) ||
          element.closest("[role='dialog'], [contenteditable='true']")
        ),
      );

      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        return;
      }
      // Tab is trapped inside the open dialog so focus cannot leak behind it.
      if (event.key === "Tab" && open) {
        const container = dialogRef.current;
        if (!container) return;
        const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;
        if (event.shiftKey && current === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && current === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (isEditing || event.altKey || event.ctrlKey || event.metaKey) return;

      if (chord) {
        const next = event.key.toLowerCase();
        if (next === "h" || next === "s") {
          event.preventDefault();
          setChord(false);
          setOpen(false);
          navigate(next === "h" ? "/dashboard/hubs" : "/dashboard/servers");
          return;
        }
        setChord(false);
      }

      if (event.key.toLowerCase() === "g") {
        event.preventDefault();
        setChord(true);
        if (chordTimer) clearTimeout(chordTimer);
        chordTimer = setTimeout(() => setChord(false), 800);
      } else if (event.key === "/") {
        const search = document.querySelector<HTMLInputElement>("[data-dashboard-search], input[type='search']");
        if (search) {
          event.preventDefault();
          search.focus();
        } else {
          // Silent keyboard affordances are dead affordances: announce the
          // no-op so screen readers and sighted users both know.
          event.preventDefault();
          setSearchMissing(true);
          if (searchMissingTimer) clearTimeout(searchMissingTimer);
          searchMissingTimer = setTimeout(() => setSearchMissing(false), 3_000);
        }
      } else if (event.key === "?") {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (chordTimer) clearTimeout(chordTimer);
      if (searchMissingTimer) clearTimeout(searchMissingTimer);
    };
  }, [chord, navigate, open]);

  if (!open) {
    return searchMissing ? (
      <div role="status" aria-live="polite" className="sr-only">No search field is available on this page.</div>
    ) : null;
  }
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <section
        ref={dialogRef}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#181726] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcut-help-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300/70">Keyboard help</p>
            <h2 id="shortcut-help-title" className="mt-1 text-lg font-bold text-white">Dashboard shortcuts</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="dashboard-btn-secondary px-2.5 py-1 text-xs"
            onClick={() => setOpen(false)}
            aria-label="Close keyboard shortcut help"
          >
            Esc
          </button>
        </div>
        <dl className="mt-5 grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-3 text-sm">
          <dt><kbd className="rounded border border-white/15 bg-white/10 px-2 py-1 font-mono text-xs text-white">/</kbd></dt>
          <dd className="m-0 text-white/70">Focus the current page search</dd>
          <dt><kbd className="rounded border border-white/15 bg-white/10 px-2 py-1 font-mono text-xs text-white">g h</kbd></dt>
          <dd className="m-0 text-white/70">Open Hubs</dd>
          <dt><kbd className="rounded border border-white/15 bg-white/10 px-2 py-1 font-mono text-xs text-white">g s</kbd></dt>
          <dd className="m-0 text-white/70">Open Servers</dd>
          <dt><kbd className="rounded border border-white/15 bg-white/10 px-2 py-1 font-mono text-xs text-white">?</kbd></dt>
          <dd className="m-0 text-white/70">Open this help</dd>
          <dt><kbd className="rounded border border-white/15 bg-white/10 px-2 py-1 font-mono text-xs text-white">Esc</kbd></dt>
          <dd className="m-0 text-white/70">Close dialogs and menus</dd>
        </dl>
        <p className="mt-5 mb-0 text-xs text-white/45">Shortcuts pause while you type, edit, or interact with a dialog.</p>
      </section>
    </div>
  );
}
