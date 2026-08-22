import type { ReactNode } from "react";
import {
  UserOutlined,
  BellOutlined,
  BgColorsOutlined,
  ThunderboltOutlined,
  CreditCardOutlined,
  RobotOutlined,
} from "@ant-design/icons";

export type SettingsCategory =
  | "account"
  | "preferences"
  | "appearance"
  | "calls"
  | "bot_config"
  | "billing";

interface SettingsMiniSidebarProps {
  activeCategory: SettingsCategory;
  onSelectCategory: (category: SettingsCategory) => void;
}

export function SettingsMiniSidebar({
  activeCategory,
  onSelectCategory,
}: SettingsMiniSidebarProps) {
  const items: Array<{
    id: SettingsCategory;
    label: string;
    icon: ReactNode;
    disabled?: boolean;
    badge?: string;
  }> = [
    { id: "account", label: "My Account", icon: <UserOutlined /> },
    { id: "preferences", label: "Preferences", icon: <BellOutlined /> },
    { id: "appearance", label: "Appearance", icon: <BgColorsOutlined /> },
    { id: "calls", label: "Call History", icon: <ThunderboltOutlined /> },
    { id: "bot_config", label: "Bot & Staff", icon: <RobotOutlined /> },
    { id: "billing", label: "Billing", icon: <CreditCardOutlined /> },
  ];

  return (
    <div
      className="w-56 p-4 flex flex-col gap-1 select-none border-r border-white/[0.08]"
      style={{ background: "#13141f" }}
    >
      <div className="px-2 pb-3 mb-1 border-b border-white/[0.08]">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[#b794f4]">
          User Settings
        </span>
        <h3 className="text-base font-bold text-white tracking-tight font-['Sora']">Preferences</h3>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = activeCategory === item.id;
          if (item.disabled) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-white/30 cursor-not-allowed opacity-60"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/60">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? "bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
