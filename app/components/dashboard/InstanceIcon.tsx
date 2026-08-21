import { useState } from "react";

interface InstanceIconProps {
  id: string;
  name: string;
  initials: string;
  color?: string;
  memberCount: number;
  type: "server" | "hub";
  isActive: boolean;
  onClick: () => void;
}

export function InstanceIcon({
  name,
  initials,
  color = "#5b4ccb",
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
      {/* Active Pill Indicator on Left Edge - Clean, no glow */}
      <span
        className={`absolute left-0 w-1 rounded-r-full transition-all duration-150 ${
          isActive
            ? "h-9 bg-[#8175ee] opacity-100 scale-100"
            : isHovered
            ? "h-5 bg-white/60 opacity-80 scale-100"
            : "h-2 bg-transparent opacity-0 scale-50"
        }`}
      />

      {/* Circular / Squircle Avatar */}
      <button
        type="button"
        className={`relative flex items-center justify-center w-12 h-12 text-sm font-bold tracking-wider transition-all duration-150 select-none ${
          isActive
            ? "rounded-2xl ring-2 ring-[#8175ee] scale-105"
            : "rounded-3xl hover:rounded-2xl hover:scale-105"
        }`}
        style={{
          backgroundColor: color || "#242238",
          color: "#ffffff",
          border: isActive
            ? "2px solid rgba(255, 255, 255, 0.4)"
            : "1px solid rgba(255, 255, 255, 0.12)",
        }}
        aria-label={`${name} (${type})`}
      >
        <span className="font-['Sora'] font-bold text-xs uppercase leading-none">{initials}</span>
      </button>

      {/* Floating Dark Tooltip on Right */}
      {isHovered && (
        <div
          className="absolute left-[76px] z-50 flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none transition-opacity duration-150 animate-fadeIn"
          style={{
            background: "rgba(17, 18, 27, 0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            color: "#f7f5ef",
          }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-white text-[13px] font-['Sora']">{name}</span>
            <span className="text-[11px] font-normal text-white/60">
              {memberCount.toLocaleString()} members · {type === "hub" ? "Hub" : "Server"}
            </span>
          </div>
          {/* Caret pointing left */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-[rgba(17,18,27,0.95)]" />
        </div>
      )}
    </div>
  );
}
