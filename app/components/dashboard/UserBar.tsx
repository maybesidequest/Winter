import { SettingOutlined } from "@ant-design/icons";
import { mockCurrentUser } from "~/data/dashboard-mock";

interface UserBarProps {
  onOpenSettings: () => void;
}

export function UserBar({ onOpenSettings }: UserBarProps) {
  const user = mockCurrentUser;

  return (
    <div
      className="p-2.5 rounded-2xl flex items-center justify-between gap-2 border select-none transition-all duration-150"
      style={{
        background: "rgba(17, 18, 27, 0.7)",
        borderColor: "rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative flex-shrink-0">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-9 h-9 rounded-xl object-cover border border-white/10"
          />
          {/* Online green indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#7ed493] border-2 border-[#151424]" />
        </div>

        <div className="min-w-0 flex flex-col">
          <span className="text-xs font-bold text-white truncate leading-tight">
            {user.name}
          </span>
          <span className="text-[11px] text-white/50 truncate leading-tight">
            {user.tag}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="User Settings"
        title="Settings"
        className="w-8 h-8 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-150 flex-shrink-0 cursor-pointer"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <SettingOutlined className="text-sm" />
      </button>
    </div>
  );
}
