import { Link, useLocation, useNavigate } from "react-router";
import {
  HomeOutlined,
  PlusOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import type { ServerResource } from "~/resources/server";
import type { HubResource } from "~/resources/hub";
import { InstanceIcon } from "./InstanceIcon";

const tooltipStyles = {
  root: { pointerEvents: "none" as const },
  container: {
    background: "rgba(17, 18, 27, 0.96)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    padding: "6px 12px",
  },
};

interface IconRailProps {
  instanceType: "servers" | "hubs";
  servers?: ServerResource[];
  hubs?: HubResource[];
  isLoading?: boolean;
  onOpenCreate?: () => void;
}

export function IconRail({
  instanceType,
  servers = [],
  hubs = [],
  isLoading = false,
  onOpenCreate,
}: IconRailProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomeActive = location.pathname === "/dashboard";
  const isBrowseActive = location.pathname.startsWith("/dashboard/browse");

  const instances =
    instanceType === "servers"
      ? servers.map((s) => ({
          id: s.metadata.id,
          name: s.metadata.name,
          initials: s.metadata.name.slice(0, 2).toUpperCase(),
          color: "#2a7198",
          iconUrl: s.metadata.iconUrl,
          memberCount: s.status.callCount,
          type: "server" as const,
        }))
      : hubs.map((h) => ({
          id: h.metadata.id,
          name: h.metadata.name,
          initials: h.metadata.name.slice(0, 2).toUpperCase(),
          color: "#5b4ccb",
          iconUrl: h.spec.iconUrl,
          memberCount: h.status.connectionCount,
          type: "hub" as const,
        }));

  return (
    <aside
      className="w-[72px] h-screen fixed top-0 left-0 z-40 flex flex-col items-center py-3 select-none"
      style={{
        background: "#0b0c14",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      aria-label="Instance Rail"
    >
      {/* 1. Top Home/Dashboard Icon */}
      <div className="relative flex items-center justify-center w-full py-1.5 group cursor-pointer">
        {/* Active Pill Indicator */}
        <span
          className={`absolute left-0 w-1 rounded-r-full transition-all duration-150 ${
            isHomeActive
              ? "h-9 bg-[#8175ee] opacity-100 scale-100"
              : "h-2 bg-transparent opacity-0 scale-50 group-hover:h-5 group-hover:bg-white/60 group-hover:opacity-80 group-hover:scale-100"
          }`}
        />

        <Tooltip
          placement="right"
          mouseEnterDelay={0.05}
          title={<span className="font-bold text-white text-[13px] font-['Sora']">Dashboard Home</span>}
          styles={tooltipStyles}
          arrow={false}
        >
          <Link
            to="/dashboard"
            className={`relative flex items-center justify-center w-12 h-12 text-lg transition-all duration-150 ${
              isHomeActive
                ? "rounded-2xl bg-[#5b4ccb] text-white"
                : "rounded-3xl bg-[#13141f] text-white/80 hover:bg-[#5b4ccb] hover:text-white hover:rounded-2xl"
            }`}
            style={{
              border: isHomeActive ? "1px solid #7d70e8" : "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: isHomeActive ? "0 1.5px 0 0 #7d70e8" : "0 1.5px 0 0 rgba(255, 255, 255, 0.08)",
            }}
            aria-label="Dashboard Home"
          >
            <HomeOutlined className="text-xl" />
          </Link>
        </Tooltip>
      </div>

      {/* Divider */}
      <div className="w-8 h-[1px] my-2 bg-white/10 rounded-full flex-shrink-0" />

      {/* 2. Middle Scrollable Instance List */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col items-center py-1 gap-1">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 py-1 w-full animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-3xl bg-white/[0.05] border border-white/[0.06]"
              />
            ))}
          </div>
        ) : (
          instances.map((inst) => {
            const isHub = instanceType === "hubs";
            const itemPath = isHub
              ? `/dashboard/hubs/${inst.id}`
              : `/dashboard/servers/${inst.id}`;
            const isInstanceActive = location.pathname.startsWith(itemPath);

            return (
              <InstanceIcon
                key={inst.id}
                id={inst.id}
                name={inst.name}
                initials={inst.initials}
                color={inst.color}
                iconUrl={inst.iconUrl}
                memberCount={inst.memberCount}
                type={isHub ? "hub" : "server"}
                isActive={isInstanceActive}
                onClick={() => {
                  navigate(isHub ? `${itemPath}/overview` : `${itemPath}/overview`);
                }}
              />
            );
          })
        )}
      </div>

      {/* Divider */}
      <div className="w-8 h-[1px] my-2 bg-white/10 rounded-full flex-shrink-0" />

      {/* 3. Bottom Global Actions */}
      <div className="w-full flex flex-col items-center gap-1 flex-shrink-0">
        {/* Create Button [+] */}
        <div className="relative flex items-center justify-center w-full py-1.5 group cursor-pointer">
          <Tooltip
            placement="right"
            mouseEnterDelay={0.05}
            title={<span className="font-bold text-white text-[13px] font-['Sora']">Create Hub</span>}
            styles={tooltipStyles}
            arrow={false}
          >
            <button
              type="button"
              onClick={onOpenCreate}
              className="flex items-center justify-center w-12 h-12 rounded-3xl bg-[#13141f] text-[#7ed493] hover:bg-[#7ed493] hover:text-[#100e18] hover:rounded-2xl transition-all duration-150 cursor-pointer"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 1.5px 0 0 rgba(255, 255, 255, 0.08)",
              }}
              aria-label="Create new Hub"
            >
              <PlusOutlined className="text-lg font-bold" />
            </button>
          </Tooltip>
        </div>

        {/* Explore / Browse */}
        <div className="relative flex items-center justify-center w-full py-1.5 group cursor-pointer">
          <span
            className={`absolute left-0 w-1 rounded-r-full transition-all duration-150 ${
              isBrowseActive
                ? "h-9 bg-[#8175ee] opacity-100 scale-100"
                : "h-2 bg-transparent opacity-0 scale-50 group-hover:h-5 group-hover:bg-white/60 group-hover:opacity-80 group-hover:scale-100"
            }`}
          />
          <Tooltip
            placement="right"
            mouseEnterDelay={0.05}
            title={<span className="font-bold text-white text-[13px] font-['Sora']">Explore Hubs</span>}
            styles={tooltipStyles}
            arrow={false}
          >
            <Link
              to="/dashboard/browse"
              className={`flex items-center justify-center w-12 h-12 text-lg transition-all duration-150 ${
                isBrowseActive
                  ? "rounded-2xl bg-[#2a7198] text-white"
                  : "rounded-3xl bg-[#13141f] text-white/80 hover:bg-[#2a7198] hover:text-white hover:rounded-2xl"
              }`}
              style={{
                border: isBrowseActive ? "1px solid #489cc9" : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: isBrowseActive ? "0 1.5px 0 0 #489cc9" : "0 1.5px 0 0 rgba(255, 255, 255, 0.08)",
              }}
              aria-label="Browse Hubs"
            >
              <CompassOutlined className="text-xl" />
            </Link>
          </Tooltip>
        </div>

      </div>
    </aside>
  );
}
