import { CheckCircleOutlined, SendOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { orpc } from "~/lib/orpc";

type FeedbackCategory = "general" | "dashboard" | "hub" | "safety";

const CATEGORIES: Array<{ value: FeedbackCategory; label: string }> = [
  { value: "general", label: "General feedback & ideas" },
  { value: "dashboard", label: "Dashboard & controls" },
  { value: "hub", label: "Hub features & bridges" },
  { value: "safety", label: "Trust & Safety / Automod" },
];

export function HelpFeedbackForm() {
  const [category, setCategory] = useState<FeedbackCategory>("general");
  const [messageText, setMessageText] = useState("");
  const [receipt, setReceipt] = useState<{ id: string; category: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const feedbackKeyRef = useRef(crypto.randomUUID());

  const submitMutation = useMutation(
    orpc.user.submitFeedback.mutationOptions({
      onSuccess: (data) => {
        setReceipt(data);
        setMessageText("");
        setError(null);
        feedbackKeyRef.current = crypto.randomUUID();
      },
      onError: (err) => {
        setError(err.message || "Failed to submit feedback. Please try again.");
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (trimmed.length < 10) {
      setError("Feedback message must be at least 10 characters long.");
      return;
    }
    setError(null);
    submitMutation.mutate({
      category,
      message: trimmed,
      idempotencyKey: feedbackKeyRef.current,
    });
  };

  return (
    <div
      className="rounded-2xl p-6 border flex flex-col gap-5"
      style={dashboardGlassCardStyle}
    >
      <div>
        <h3 className="text-base font-bold text-white font-['Sora'] m-0">
          Send Feedback
        </h3>
        <p className="text-xs text-white/65 m-0 mt-0.5">
          Have an idea or spotted a bug? Send feedback directly to the InterChat core team.
        </p>
      </div>

      {receipt ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircleOutlined className="text-emerald-400 text-lg mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white m-0">
                Feedback received!
              </h4>
              <p className="text-xs text-white/60 m-0 mt-1">
                Receipt ID:{" "}
                <code className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-emerald-300">
                  {receipt.id}
                </code>{" "}
                · Category: <strong className="text-white capitalize">{receipt.category}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReceipt(null)}
            className="dashboard-btn-secondary !min-h-[32px] !px-3 !py-1 !text-xs !font-bold flex-shrink-0"
          >
            Send more feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5 max-w-xs">
            <label htmlFor="feedback-category" className="text-white/70 font-semibold">
              Category
            </label>
            <select
              id="feedback-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
              className="dashboard-input text-xs font-bold py-1.5 px-3 min-h-[36px] bg-[#13141f] border border-white/10 rounded-xl text-white cursor-pointer focus:border-[#8175ee] focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-[#13141f] text-white">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="feedback-message" className="text-white/70 font-semibold">
              Your feedback or suggestion <span className="text-red-400">*</span>
            </label>
            <textarea
              id="feedback-message"
              rows={4}
              maxLength={2000}
              required
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Share your thoughts, report an issue, or suggest a new feature…"
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-white/30 focus:border-[#8175ee] focus:outline-none transition-colors"
            />
            {error && <span className="text-xs text-red-400">{error}</span>}
            <div className="flex justify-between text-xs text-white/60">
              <span>Must be between 10 and 2,000 characters.</span>
              <span>{messageText.length}/2000</span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="dashboard-btn-primary !min-h-[36px] !px-4 !py-1.5 !text-xs !font-bold flex items-center gap-1.5"
            >
              <SendOutlined className="text-xs" />
              <span>{submitMutation.isPending ? "Sending…" : "Submit Feedback"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

