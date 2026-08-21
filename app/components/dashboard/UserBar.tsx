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
      className="py-2.5 px-3 min-h-[54px] rounded-2xl flex items-center justify-between gap-2 border select-none transition-all duration-150"
      style={{
        background: "rgba(17, 18, 27, 0.75)",
        borderColor: "rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* User Avatar with Initial & Name */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-full bg-[#5b4ccb] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-['Sora'] shadow-sm">
          {user.name.charAt(0)}
        </div>

        <div className="min-w-0 flex flex-col justify-center">
          <span className="text-xs font-bold text-white truncate leading-tight font-['Sora']">
            {user.name}
          </span>
          <span className="text-[10.5px] text-white/50 truncate leading-tight mt-0.5">
            {user.role}
          </span>
        </div>
      </div>

      {/* Action Icons (Creem style) */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <BellOutlined className="text-sm" />
        </button>

        <button
          type="button"
          aria-label="Documentation"
          title="Documentation"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => window.open("https://interchat.gg/docs", "_blank")}
        >
          <ReadOutlined className="text-sm" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="User Settings"
          title="Settings"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <SettingOutlined className="text-sm" />
        </button>
      </div>
    </div>
  );
}
