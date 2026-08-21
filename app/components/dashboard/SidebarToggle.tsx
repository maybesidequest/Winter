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
          border: value === "servers" ? "1px solid #7d70e8" : "1px solid transparent",
          boxShadow: value === "servers" ? "0 1.5px 0 0 #7d70e8" : undefined,
        }}
      >
        <CloudServerOutlined className="text-[15px]" />
        <span>Servers</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("hubs")}
        className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-bold transition-all duration-120 flex items-center justify-center gap-2 cursor-pointer ${
          value === "hubs"
            ? "text-white"
            : "text-white/50 hover:text-white/80 hover:bg-white/5"
        }`}
        style={{
          background: value === "hubs" ? "#5b4ccb" : "transparent",
          border: value === "hubs" ? "1px solid #7d70e8" : "1px solid transparent",
          boxShadow: value === "hubs" ? "0 1.5px 0 0 #7d70e8" : undefined,
        }}
      >
        <ClusterOutlined className="text-[15px]" />
        <span>Hubs</span>
      </button>
    </div>
  );
}
