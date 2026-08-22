import { GlobalOutlined, LockOutlined, MessageOutlined, ClusterOutlined } from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { HubFormValues } from "~/components/CreateHubWizard/types";

interface ReviewStepProps {
  formData: HubFormValues;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  const hubInitials = formData.name.trim().slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6 max-w-xl w-full">
      {/* Live Hub Preview Card */}
      <div
        className="rounded-2xl border overflow-hidden relative flex flex-col"
        style={dashboardGlassCardStyle}
      >
        {/* Banner Area */}
        <div className="h-24 bg-gradient-to-r from-violet-950/60 via-purple-900/40 to-slate-900 relative overflow-hidden">
          {formData.bannerUrl && (
            <img
              src={formData.bannerUrl}
              alt="Hub Banner"
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* Overlapping Avatar Icon */}
          <div className="absolute -bottom-5 left-5 w-14 h-14 rounded-2xl overflow-hidden bg-[#13141f] border-2 border-white/20 flex items-center justify-center text-base font-bold text-violet-300 shadow-lg font-['Sora']">
            {formData.iconUrl ? (
              <img
                src={formData.iconUrl}
                alt="Hub Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : hubInitials ? (
              <span>{hubInitials}</span>
            ) : (
              <ClusterOutlined className="text-xl text-violet-400/70" />
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="pt-8 p-5 sm:p-6 flex flex-col gap-3 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                Hub Preview
              </span>
              <h3 className="text-lg font-bold text-white font-['Sora'] tracking-tight m-0 mt-0.5">
                {formData.name || "Untitled Hub"}
              </h3>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {formData.visibility}
            </span>
          </div>

          <p className="text-xs text-white/70 leading-relaxed m-0">
            {formData.shortDescription || "No summary provided."}
          </p>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/80">
              🌐 {formData.language}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/80">
              📍 {formData.region}
            </span>
            {formData.welcomeMessage && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-violet-500/10 border border-violet-500/20 text-violet-200">
                💬 Welcome broadcast configured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div
          className="p-4 rounded-2xl border flex flex-col gap-2 relative overflow-hidden"
          style={{
            background: "#13141f",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 3px 0 0 rgba(10, 8, 23, 0.65)",
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-300">
            <GlobalOutlined className="text-sm" />
          </div>
          <div className="flex flex-col gap-0.5">
            <strong className="text-xs font-bold text-white font-['Sora']">Discovery Ready</strong>
            <span className="text-[11px] text-white/50 leading-relaxed">
              Visibility and region tags are tuned for explore indexing.
            </span>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border flex flex-col gap-2 relative overflow-hidden"
          style={{
            background: "#13141f",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 3px 0 0 rgba(10, 8, 23, 0.65)",
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center text-violet-300">
            <MessageOutlined className="text-sm" />
          </div>
          <div className="flex flex-col gap-0.5">
            <strong className="text-xs font-bold text-white font-['Sora']">Tone Prepared</strong>
            <span className="text-[11px] text-white/50 leading-relaxed">
              New guild bridges greet members with your configured welcome message.
            </span>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border flex flex-col gap-2 relative overflow-hidden"
          style={{
            background: "#13141f",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 3px 0 0 rgba(10, 8, 23, 0.65)",
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <LockOutlined className="text-sm" />
          </div>
          <div className="flex flex-col gap-0.5">
            <strong className="text-xs font-bold text-white font-['Sora']">Safe Defaults</strong>
            <span className="text-[11px] text-white/50 leading-relaxed">
              Hub initializes unlocked and ready for server bridges and automod rules.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
