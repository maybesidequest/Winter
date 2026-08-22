import { ClusterOutlined } from "@ant-design/icons";
import type { HubFormValues } from "~/components/CreateHubWizard/types";

interface IdentityStepProps {
  formData: HubFormValues;
  updateField: <K extends keyof HubFormValues>(field: K, value: HubFormValues[K]) => void;
  fieldErrors: Partial<Record<keyof HubFormValues, string>>;
}

export function IdentityStep({ formData, updateField, fieldErrors }: IdentityStepProps) {
  const hubInitials = formData.name.trim().slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6 max-w-xl w-full">
      {/* Icon + Name & Icon URL Grid */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Hub Icon Preview */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 self-center sm:self-start">
          <div className="w-18 h-18 rounded-2xl overflow-hidden bg-violet-950/50 border border-violet-400/25 flex items-center justify-center text-lg font-bold text-violet-300 shadow-[0_4px_12px_rgba(0,0,0,0.4)] font-['Sora'] relative">
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
              <ClusterOutlined className="text-2xl text-violet-400/60" />
            )}
          </div>
          <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">
            Icon Preview
          </span>
        </div>

        {/* Name & Icon URL Fields */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90 flex items-center justify-between">
              <span>Hub Name <span className="text-red-400">*</span></span>
              {fieldErrors.name && (
                <span className="text-[11px] font-normal text-red-400">{fieldErrors.name}</span>
              )}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Gaming Network"
              className={`dashboard-input text-xs ${
                fieldErrors.name ? "!border-red-500/60 !shadow-[0_1.5px_0_0_rgba(239,68,68,0.4)]" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">
              Icon URL <span className="text-[11px] font-normal text-white/40">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.iconUrl}
              onChange={(e) => updateField("iconUrl", e.target.value)}
              placeholder="https://example.com/icon.png"
              className="dashboard-input text-xs"
            />
          </div>
        </div>
      </div>

      {/* Short Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-white/90 flex items-center justify-between">
          <span>Short Summary <span className="text-red-400">*</span></span>
          {fieldErrors.shortDescription && (
            <span className="text-[11px] font-normal text-red-400">{fieldErrors.shortDescription}</span>
          )}
        </label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          placeholder="Brief 1-line hook explaining what this hub connects..."
          className={`dashboard-input text-xs ${
            fieldErrors.shortDescription ? "!border-red-500/60 !shadow-[0_1.5px_0_0_rgba(239,68,68,0.4)]" : ""
          }`}
        />
        <span className="text-[11px] text-white/40">
          Displayed across server discovery cards and public bridge invites.
        </span>
      </div>

      {/* Full Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-white/90">
          Full Description <span className="text-[11px] font-normal text-white/40">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Elaborate on your community rules, game titles, or broadcast schedules..."
          className="dashboard-textarea text-xs"
        />
      </div>
    </div>
  );
}
