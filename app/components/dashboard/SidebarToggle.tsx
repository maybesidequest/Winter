import { CloudServerOutlined, ClusterOutlined } from "@ant-design/icons";

interface SidebarToggleProps {
  value: "servers" | "hubs";
  onChange: (value: "servers" | "hubs") => void;
}

export function SidebarToggle({ value, onChange }: SidebarToggleProps) {
  return (
    <div
      className="p-1 rounded-xl flex items-center gap-1 w-full select-none"
      style={{
        background: "rgba(17, 18, 27, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("servers")}
        className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
          value === "servers"
            ? "text-white"
            : "text-white/50 hover:text-white/80 hover:bg-white/5"
        }`}
        style={{
          background: value === "servers" ? "#5b4ccb" : "transparent",
          borderTop: value === "servers" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
          borderLeft: value === "servers" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent",
          borderRight: value === "servers" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent",
          borderBottom: value === "servers" ? "3px solid #3b2fa8" : "3px solid transparent",
        }}
      >
        <CloudServerOutlined className="text-[15px]" />
        <span>Servers</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("hubs")}
        className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
          value === "hubs"
            ? "text-white"
            : "text-white/50 hover:text-white/80 hover:bg-white/5"
        }`}
        style={{
          background: value === "hubs" ? "#5b4ccb" : "transparent",
          borderTop: value === "hubs" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
          borderLeft: value === "hubs" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent",
          borderRight: value === "hubs" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent",
          borderBottom: value === "hubs" ? "3px solid #3b2fa8" : "3px solid transparent",
        }}
      >
        <ClusterOutlined className="text-[15px]" />
        <span>Hubs</span>
      </button>
    </div>
  );
}
