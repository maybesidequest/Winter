import {
  SettingOutlined,
  BellOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { mockCurrentUser } from "~/data/dashboard-mock";

interface UserBarProps {
  onOpenSettings: () => void;
}

export function UserBar({ onOpenSettings }: UserBarProps) {
  const user = mockCurrentUser;

  return (
    <div
      className="p-2 rounded-2xl flex items-center justify-between gap-1.5 border select-none"
      style={{
        background: "rgba(17, 18, 27, 0.7)",
        borderColor: "rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* User Avatar with Initial & Name */}
      <div className="flex items-center gap-2 min-w-0 flex-1 pl-1">
        <div className="w-7 h-7 rounded-full bg-[#5b4ccb] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-['Sora']">
          {user.name.charAt(0)}
        </div>

        <div className="min-w-0 flex flex-col">
          <span className="text-xs font-bold text-white truncate leading-tight font-['Sora']">
            {user.name}
          </span>
          <span className="text-[10px] text-white/40 truncate leading-tight">
            {user.role}
          </span>
        </div>
      </div>

      {/* Action Icons (Creem style) */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          onClick={onOpenSettings}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <BellOutlined className="text-xs" />
        </button>

        <button
          type="button"
          aria-label="Documentation"
          title="Documentation"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => window.open("https://interchat.gg/docs", "_blank")}
        >
          <ReadOutlined className="text-xs" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="User Settings"
          title="Settings"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <SettingOutlined className="text-xs" />
        </button>
      </div>
    </div>
  );
}
