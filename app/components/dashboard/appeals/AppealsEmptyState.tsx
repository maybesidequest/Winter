import { SafetyCertificateOutlined } from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

export function AppealsEmptyState() {
  return (
    <div
      style={dashboardGlassCardStyle}
      className="p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center gap-3"
    >
      <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center text-emerald-300 text-xl">
        <SafetyCertificateOutlined />
      </div>
      <h3 className="font-['Sora'] text-base font-bold text-white m-0">No active sanctions</h3>
      <p className="text-xs text-white/60 max-w-md m-0 leading-relaxed">
        Your account is in good standing across all connected Hubs. If a moderation action or sanction is ever issued,
        you will be able to review the details and submit an appeal here.
      </p>
    </div>
  );
}

