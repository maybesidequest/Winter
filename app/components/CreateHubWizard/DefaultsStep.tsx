import { LANGUAGE_OPTIONS, REGION_OPTIONS, VISIBILITY_OPTIONS } from "~/components/CreateHubWizard/types";
import type { HubFormValues } from "~/components/CreateHubWizard/types";

interface DefaultsStepProps {
  formData: HubFormValues;
  updateField: <K extends keyof HubFormValues>(field: K, value: HubFormValues[K]) => void;
}

export function DefaultsStep({ formData, updateField }: DefaultsStepProps) {
  return (
    <div className="flex flex-col gap-6 max-w-xl w-full">
      {/* Visibility Cards */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-white/90">Directory Visibility</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VISIBILITY_OPTIONS.map((option) => {
            const selected = formData.visibility === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField("visibility", option.value as HubFormValues["visibility"])}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  selected
                    ? "bg-violet-500/15 border-violet-400 text-white shadow-sm"
                    : "bg-white/[0.02] border-white/[0.08] text-white/70 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold font-['Sora']">{option.title}</strong>
                  {selected && (
                    <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  )}
                </div>
                <span className="text-[11px] text-white/50 leading-relaxed">{option.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language & Region Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90">Primary Language</label>
          <select
            value={formData.language}
            onChange={(e) => updateField("language", e.target.value)}
            className="dashboard-select text-xs cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#181726] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90">Primary Region</label>
          <select
            value={formData.region}
            onChange={(e) => updateField("region", e.target.value)}
            className="dashboard-select text-xs cursor-pointer"
          >
            {REGION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#181726] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-white/90">
          Welcome Broadcast Message <span className="text-[11px] font-normal text-white/40">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={formData.welcomeMessage}
          onChange={(e) => updateField("welcomeMessage", e.target.value)}
          placeholder="Welcome to the bridge! Messages sent here will broadcast across all connected servers..."
          className="dashboard-textarea text-xs"
        />
      </div>

      {/* Banner Image */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-white/90">
          Banner Image URL <span className="text-[11px] font-normal text-white/40">(optional)</span>
        </label>
        {formData.bannerUrl && (
          <div className="w-full h-24 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] relative mb-1 shadow-md">
            <img
              src={formData.bannerUrl}
              alt="Banner Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <input
          type="url"
          value={formData.bannerUrl}
          onChange={(e) => updateField("bannerUrl", e.target.value)}
          placeholder="https://example.com/banner.png"
          className="dashboard-input text-xs"
        />
      </div>
    </div>
  );
}
