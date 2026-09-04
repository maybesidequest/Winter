import { GlobalOutlined, PlusOutlined } from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

type EmptyDashboardStateProps = {
  onCreateHub: () => void;
};

export function EmptyDashboardState({ onCreateHub }: EmptyDashboardStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
      <div
        style={dashboardGlassCardStyle}
        className="p-10 md:p-12 rounded-3xl border border-white/10 flex flex-col items-center text-center max-w-md w-full shadow-2xl"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#8175ee]/15 border border-[#8175ee]/30 flex items-center justify-center text-[#8175ee] text-2xl mb-4 shadow-[0_2px_0_0_#5b4ccb]">
          <GlobalOutlined />
        </div>
        <h2 className="font-['Sora'] text-xl font-bold text-white m-0 mb-2">
          Ready to connect?
        </h2>
        <p className="text-sm text-white/60 m-0 mb-6 max-w-xs leading-relaxed">
          Create your first Hub to start moderating and bridging chat channels across multiple Discord servers.
        </p>
        <button
          type="button"
          onClick={onCreateHub}
          className="dashboard-btn-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <PlusOutlined />
          <span>Create Hub</span>
        </button>
      </div>
    </div>
  );
}