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
        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
          value === "servers"
            ? "text-white"
            : "text-white/50 hover:text-white/80 hover:bg-white/5"
        }`}
        style={{
          background: value === "servers" ? "#5b4ccb" : "transparent",
        }}
      >
        <CloudServerOutlined className="text-sm" />
        <span>Servers</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("hubs")}
        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
          value === "hubs"
            ? "text-white"
            : "text-white/50 hover:text-white/80 hover:bg-white/5"
        }`}
        style={{
          background: value === "hubs" ? "#5b4ccb" : "transparent",
        }}
      >
        <ClusterOutlined className="text-sm" />
        <span>Hubs</span>
      </button>
    </div>
  );
}
