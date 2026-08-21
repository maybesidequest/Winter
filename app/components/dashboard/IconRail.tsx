import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  HomeOutlined,
  PlusOutlined,
  CompassOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ServerResource } from "~/resources/server";
import type { HubResource } from "~/resources/hub";
import { InstanceIcon } from "./InstanceIcon";

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
  const [homeHover, setHomeHover] = useState(false);
  const [plusHover, setPlusHover] = useState(false);
  const [browseHover, setBrowseHover] = useState(false);
  const [callsHover, setCallsHover] = useState(false);

  const isHomeActive = location.pathname === "/dashboard";
  const isBrowseActive = location.pathname.startsWith("/dashboard/browse");
  const isCallsActive = location.pathname.startsWith("/dashboard/calls");

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
        background: "#0e0d18",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      aria-label="Instance Rail"
    >
      {/* 1. Top Home/Dashboard Icon */}
      <div
        className="relative flex items-center justify-center w-full py-1.5 group cursor-pointer"
        onMouseEnter={() => setHomeHover(true)}
        onMouseLeave={() => setHomeHover(false)}
      >
        {/* Active Pill Indicator - No Glow */}
        <span
          className={`absolute left-0 w-1 rounded-r-full transition-all duration-150 ${
            isHomeActive
              ? "h-9 bg-[#8175ee] opacity-100 scale-100"
              : homeHover
              ? "h-5 bg-white/60 opacity-80 scale-100"
              : "h-2 bg-transparent opacity-0 scale-50"
          }`}
        />

        <Link
          to="/dashboard"
          className={`relative flex items-center justify-center w-12 h-12 text-lg transition-all duration-150 ${
            isHomeActive
              ? "rounded-2xl bg-[#5b4ccb] text-white ring-2 ring-[#8175ee] scale-105"
              : "rounded-3xl bg-[#19172b] text-white/80 hover:bg-[#5b4ccb] hover:text-white hover:rounded-2xl hover:scale-105"
          }`}
          style={{
            border: isHomeActive
              ? "2px solid rgba(255, 255, 255, 0.4)"
              : "1px solid rgba(255, 255, 255, 0.12)",
          }}
          aria-label="Dashboard Home"
        >
          <HomeOutlined className="text-xl" />
        </Link>

        {/* Floating Tooltip */}
        {homeHover && (
          <div
            className="absolute left-[76px] z-50 flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none transition-opacity duration-150 animate-fadeIn"
            style={{
              background: "rgba(17, 18, 27, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "#f7f5ef",
            }}
          >
            <span className="font-bold text-white text-[13px] font-['Sora']">Dashboard Home</span>
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-[rgba(17,18,27,0.95)]" />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-8 h-[1px] my-2 bg-white/10 rounded-full flex-shrink-0" />

      {/* 2. Middle Scrollable Instance List */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden dark-scrollbar flex flex-col items-center py-1 gap-1">
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
        <div
          className="relative flex items-center justify-center w-full py-1.5 group cursor-pointer"
          onMouseEnter={() => setPlusHover(true)}
          onMouseLeave={() => setPlusHover(false)}
        >
          <button
            type="button"
            onClick={onOpenCreate}
            className="flex items-center justify-center w-12 h-12 rounded-3xl bg-[#19172b] text-[#7ed493] hover:bg-[#7ed493] hover:text-[#11121b] hover:rounded-2xl hover:scale-105 transition-all duration-150 border border-white/10 cursor-pointer"
            aria-label="Create new Hub or Server"
          >
            <PlusOutlined className="text-lg font-bold" />
          </button>
          {plusHover && (
            <div
              className="absolute left-[76px] z-50 flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none"
              style={{
                background: "rgba(17, 18, 27, 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "#f7f5ef",
              }}
            >
              <span className="font-bold text-white text-[13px] font-['Sora']">
                Create Hub
              </span>
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-[rgba(17,18,27,0.95)]" />
            </div>
          )}
        </div>

        {/* Explore / Browse */}
        <div
          className="relative flex items-center justify-center w-full py-1.5 group cursor-pointer"
          onMouseEnter={() => setBrowseHover(true)}
          onMouseLeave={() => setBrowseHover(false)}
        >
          <span
            className={`absolute left-0 w-1 rounded-r-full transition-all duration-150 ${
              isBrowseActive
                ? "h-9 bg-[#8175ee] opacity-100 scale-100"
                : browseHover
                ? "h-5 bg-white/60 opacity-80 scale-100"
                : "h-2 bg-transparent opacity-0 scale-50"
            }`}
          />
          <Link
            to="/dashboard/browse"
            className={`flex items-center justify-center w-12 h-12 text-lg transition-all duration-150 ${
              isBrowseActive
                ? "rounded-2xl bg-[#2a7198] text-white ring-2 ring-[#8fd3ff] scale-105"
                : "rounded-3xl bg-[#19172b] text-white/80 hover:bg-[#2a7198] hover:text-white hover:rounded-2xl hover:scale-105"
            }`}
            style={{
              border: isBrowseActive
                ? "2px solid rgba(255, 255, 255, 0.4)"
                : "1px solid rgba(255, 255, 255, 0.12)",
            }}
            aria-label="Browse Hubs"
          >
            <CompassOutlined className="text-xl" />
          </Link>
          {browseHover && (
            <div
              className="absolute left-[76px] z-50 flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none"
              style={{
                background: "rgba(17, 18, 27, 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "#f7f5ef",
              }}
            >
              <span className="font-bold text-white text-[13px] font-['Sora']">Explore Hubs</span>
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-[rgba(17,18,27,0.95)]" />
            </div>
          )}
        </div>

        {/* Global Calls */}
        <div
          className="relative flex items-center justify-center w-full py-1.5 group cursor-pointer"
          onMouseEnter={() => setCallsHover(true)}
          onMouseLeave={() => setCallsHover(false)}
        >
          <span
            className={`absolute left-0 w-1 rounded-r-full transition-all duration-150 ${
              isCallsActive
                ? "h-9 bg-[#8175ee] opacity-100 scale-100"
                : callsHover
                ? "h-5 bg-white/60 opacity-80 scale-100"
                : "h-2 bg-transparent opacity-0 scale-50"
            }`}
          />
          <Link
            to="/dashboard/calls"
            className={`flex items-center justify-center w-12 h-12 text-lg transition-all duration-150 ${
              isCallsActive
                ? "rounded-2xl bg-[#5b4ccb] text-white ring-2 ring-[#8175ee] scale-105"
                : "rounded-3xl bg-[#19172b] text-white/80 hover:bg-[#5b4ccb] hover:text-white hover:rounded-2xl hover:scale-105"
            }`}
            style={{
              border: isCallsActive
                ? "2px solid rgba(255, 255, 255, 0.4)"
                : "1px solid rgba(255, 255, 255, 0.12)",
            }}
            aria-label="Global Calls"
          >
            <ThunderboltOutlined className="text-xl" />
          </Link>
          {callsHover && (
            <div
              className="absolute left-[76px] z-50 flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none"
              style={{
                background: "rgba(17, 18, 27, 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "#f7f5ef",
              }}
            >
              <span className="font-bold text-white text-[13px] font-['Sora']">Global Calls</span>
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-[rgba(17,18,27,0.95)]" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
