import { useState } from "react";
import { Tooltip } from "antd";

interface InstanceIconProps {
  id: string;
  name: string;
  initials: string;
  color?: string;
  iconUrl?: string | null;
  memberCount?: number;
  type: "server" | "hub";
  isActive: boolean;
  onClick: () => void;
}

export function InstanceIcon({
  name,
  initials,
  color = "#5b4ccb",
  iconUrl,
  memberCount,
  type,
  isActive,
  onClick,
}: InstanceIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center w-full py-1.5 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Active Pill Indicator on Left Edge */}
      <span
        className={`absolute left-0 w-1 rounded-r-full transition-all duration-150 ${
          isActive
            ? "h-9 bg-[#8175ee] opacity-100 scale-100"
            : isHovered
            ? "h-5 bg-white/60 opacity-80 scale-100"
            : "h-2 bg-transparent opacity-0 scale-50"
        }`}
      />

      {/* Circular / Squircle Avatar with Tooltip */}
      <Tooltip
        placement="right"
        mouseEnterDelay={0.05}
        title={
          <div className="flex flex-col py-0.5">
            <span className="font-bold text-white text-[13px] font-['Sora'] leading-tight">{name}</span>
            <span className="text-[11px] font-normal text-white/60 leading-tight mt-0.5">
              {type === "hub" ? "Hub" : "Discord Server"}
            </span>
          </div>
        }
        styles={{
          root: { pointerEvents: "none" },
          body: {
            background: "rgba(17, 18, 27, 0.96)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            padding: "6px 12px",
          },
        }}
        arrow={false}
      >
        <button
          type="button"
          className={`relative flex items-center justify-center w-12 h-12 text-sm font-bold tracking-wider transition-all duration-150 select-none overflow-hidden cursor-pointer ${
            isActive
              ? "rounded-2xl"
              : "rounded-3xl hover:rounded-2xl"
          }`}
          style={{
            backgroundColor: color || "#242238",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: isActive
              ? "0 3px 0 0 #3a3258, 0 3px 6px 0 rgba(17, 14, 33, 0.45)"
              : "0 3px 0 0 #090814, 0 2px 4px 0 rgba(0, 0, 0, 0.4)",
          }}
          aria-label={`${name} (${type})`}
        >
          {iconUrl ? (
            <img src={iconUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-['Sora'] font-bold text-xs uppercase leading-none">{initials}</span>
          )}
        </button>
      </Tooltip>
    </div>
  );
}

