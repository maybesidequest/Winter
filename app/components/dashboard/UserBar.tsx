import {
  SettingOutlined,
  BellOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import type { User } from "~/services/auth.server";

interface UserBarProps {
  user?: User;
  onOpenSettings: () => void;
}

export function UserBar({ user, onOpenSettings }: UserBarProps) {
  const username = user?.username || "Alex";
  const avatarUrl = user?.avatarUrl;
  const isStaff = user?.isStaff ?? false;

  return (
    <div
      className="p-2.5 px-3 min-h-[58px] rounded-2xl flex items-center justify-between gap-2.5 border select-none transition-all duration-150"
      style={{
        background: "rgba(17, 18, 27, 0.75)",
        borderTop: "1px solid rgba(255, 255, 255, 0.10)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "3px solid #0d0c16",
        boxShadow: "none",
      }}
    >
      {/* Clickable User Avatar & Details Section */}
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex items-center gap-2.5 min-w-0 flex-1 p-1 -m-1 rounded-xl text-left hover:bg-white/[0.04] transition-colors cursor-pointer group"
        aria-label="Open User Settings"
      >
        <div className="relative w-8.5 h-8.5 rounded-full bg-[#5b4ccb] flex items-center justify-center text-sm font-bold text-white flex-shrink-0 font-['Sora'] shadow-sm border border-white/10 overflow-hidden group-hover:ring-2 group-hover:ring-violet-400/50 transition-all">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{username.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="min-w-0 flex flex-col justify-center">
          <span className="text-[13px] font-bold text-white truncate leading-tight font-['Sora'] group-hover:text-violet-300 transition-colors">
            {username}
          </span>
          <span className="text-[11px] text-white/50 truncate leading-tight mt-0.5">
            {isStaff ? "InterChat Staff" : "Hub Owner"}
          </span>
        </div>
      </button>

      {/* Action Icons with 3D tactile back shadow */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          onClick={onOpenSettings}
          className="dashboard-keycap-btn w-8 h-8 rounded-lg"
        >
          <BellOutlined className="text-sm" />
        </button>

        <button
          type="button"
          aria-label="Documentation"
          title="Documentation"
          className="dashboard-keycap-btn w-8 h-8 rounded-lg"
          onClick={() => window.open("https://interchat.gg/docs", "_blank")}
        >
          <ReadOutlined className="text-sm" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="User Settings"
          title="Settings"
          className="dashboard-keycap-btn w-8 h-8 rounded-lg"
        >
          <SettingOutlined className="text-sm" />
        </button>
      </div>
    </div>
  );
}
