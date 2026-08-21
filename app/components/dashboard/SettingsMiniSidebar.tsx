export type SettingsCategory =
  | "account"
  | "notifications"
  | "appearance"
  | "calls"
  | "billing"
  | "bot_config";

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
    icon: string;
    disabled?: boolean;
    badge?: string;
  }> = [
      { id: "account", label: "My Account", icon: "👤" },
      { id: "notifications", label: "Notifications", icon: "🔔" },
      { id: "appearance", label: "Appearance", icon: "🎨" },
      { id: "calls", label: "Call History", icon: "⚡" },
      { id: "billing", label: "Billing", icon: "💳", disabled: true, badge: "Soon" },
      { id: "bot_config", label: "Global Bot Configuration", icon: "🤖" },
    ];

  return (
    <div
      className="w-56 p-4 flex flex-col gap-1 select-none border-r border-white/10"
      style={{ background: "rgba(17, 18, 27, 0.95)" }}
    >
      <div className="px-2 pb-3 mb-1 border-b border-white/10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
          User Settings
        </span>
        <h3 className="text-base font-bold text-white tracking-tight">Preferences</h3>
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
                  <span>{item.icon}</span>
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
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer ${isActive
                  ? "bg-[#5b4ccb] text-white shadow-sm shadow-[#5b4ccb]/40"
                  : "text-white/70 hover:text-white hover:bg-white/5"
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
