import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { NavLink } from "react-router";

export interface SidebarItemDef {
  path: string;
  label: string;
  icon: React.ReactNode;
  visible?: boolean;
  badge?: React.ReactNode;
  end?: boolean;
}

export interface SidebarNavGroupProps {
  id: string;
  title: string;
  colorClass?: string;
  defaultCollapsed?: boolean;
  basePath?: string;
  items?: SidebarItemDef[];
  onNavigate?: () => void;
  children?: React.ReactNode;
}

export function SidebarNavLink({
  to,
  label,
  icon,
  badge,
  end = false,
  onClick,
}: {
  to: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
          isActive
            ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1.5px_0_0_#5b4ccb]"
            : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
        }`
      }
    >
      {icon && (
        <span className="text-base text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5">
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
      {badge !== undefined && (
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-purple-200/80 border border-white/[0.08] font-mono group-hover:text-white transition-colors">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export function SidebarNavGroup({
  id,
  title,
  colorClass = "text-purple-300/70",
  defaultCollapsed = false,
  basePath = "",
  items,
  onNavigate,
  children,
}: SidebarNavGroupProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const visibleItems = items ? items.filter((item) => item.visible !== false) : null;
  if (visibleItems && visibleItems.length === 0 && !children) return null;

  return (
    <div key={id} className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        className="group flex items-center justify-between w-full px-3.5 pt-3 pb-1.5 select-none text-left cursor-pointer transition-colors rounded-lg hover:bg-white/[0.02]"
      >
        <span className={`text-xs font-bold uppercase tracking-wider truncate ${colorClass}`}>
          {title}
        </span>
        <DownOutlined
          className={`text-xs transition-transform duration-200 ${
            collapsed ? "rotate-0" : "rotate-180"
          } text-[#827d9c] group-hover:text-[#aaa9b4] flex-shrink-0`}
        />
      </button>

      {!collapsed && (
        <nav aria-label={title} className="flex flex-col gap-0.5">
          {visibleItems
            ? visibleItems.map((item) => (
                <SidebarNavLink
                  key={item.path}
                  to={basePath ? `${basePath}/${item.path}` : item.path}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge}
                  end={item.end}
                  onClick={onNavigate}
                />
              ))
            : children}
        </nav>
      )}
    </div>
  );
}

