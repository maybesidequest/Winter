import { useEffect, useState } from "react";
import { CloseOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import {
  mockCurrentUser,
  mockCallHistory,
  type MockCallHistory,
} from "~/data/dashboard-mock";
import {
  SettingsMiniSidebar,
  type SettingsCategory,
} from "./SettingsMiniSidebar";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("account");
  const user = mockCurrentUser;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl h-[620px] max-h-[90vh] rounded-3xl overflow-hidden flex border animate-fadeIn"
        style={{
          background: "#151424",
          borderColor: "rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close Settings"
        >
          <CloseOutlined className="text-sm" />
        </button>

        {/* Mini Sidebar */}
        <SettingsMiniSidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Right Content Pane */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto dark-scrollbar flex flex-col gap-6 relative">
          <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />
          
          {activeCategory === "account" && (
            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Sora'] tracking-tight">
                  My Account
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Manage your personal account details and linked Discord credentials.
                </p>
              </div>

              {/* User Identity Card */}
              <div
                className="relative overflow-hidden p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border"
                style={{
                  background: "rgba(21, 20, 36, 0.85)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />
                <div className="relative z-10 flex items-center gap-4">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
                  />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white font-['Sora']">
                        {user.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5b4ccb] text-white">
                        {user.role}
                      </span>
                    </div>
                    <span className="text-xs text-white/60">{user.email}</span>
                    <span className="text-[11px] text-white/40">
                      Member since {user.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked Discord Account Card */}
              <div
                className="p-5 rounded-2xl border flex flex-col gap-3"
                style={{
                  background: "rgba(17, 18, 27, 0.5)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-sm font-bold text-[#8175ee]">
                      <SafetyCertificateOutlined className="text-base" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Connected Discord Account</h4>
                      <p className="text-xs text-white/50">{user.tag} (ID: {user.id})</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#7ed493]/15 text-[#7ed493] border border-[#7ed493]/30">
                    Connected
                  </span>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="relative overflow-hidden p-4 rounded-2xl border"
                  style={{
                    background: "rgba(21, 20, 36, 0.6)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />
                  <div className="relative z-10">
                    <span className="text-xs text-white/50 font-medium">Hubs Managed</span>
                    <p className="text-2xl font-bold text-white mt-1 font-['Sora']">
                      {user.hubsCount}
                    </p>
                  </div>
                </div>

                <div
                  className="relative overflow-hidden p-4 rounded-2xl border"
                  style={{
                    background: "rgba(21, 20, 36, 0.6)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />
                  <div className="relative z-10">
                    <span className="text-xs text-white/50 font-medium">Servers Linked</span>
                    <p className="text-2xl font-bold text-white mt-1 font-['Sora']">
                      {user.serversCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCategory === "calls" && (
            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Sora'] tracking-tight">
                  Call History
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Log of past 1:1 and small-group text connections initiated through InterChat.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {mockCallHistory.map((call: MockCallHistory) => {
                  const isCompleted = call.status === "completed";
                  const isTerminated = call.status === "terminated";

                  return (
                    <div
                      key={call.id}
                      className="p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors hover:bg-white/[0.02]"
                      style={{
                        background: "rgba(21, 20, 36, 0.7)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-1.5">
                          <span className="w-7 h-7 rounded-lg bg-[#5b4ccb] border border-white/20 flex items-center justify-center text-[10px] font-bold text-white font-['Sora']">
                            {call.callerInitials}
                          </span>
                          <span className="w-7 h-7 rounded-lg bg-[#2a7198] border border-white/20 flex items-center justify-center text-[10px] font-bold text-white font-['Sora']">
                            {call.receiverInitials}
                          </span>
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-white block">
                            {call.caller} ↔ {call.receiver}
                          </strong>
                          <span className="text-[11px] text-white/50">
                            {call.hub} · {call.messages} messages
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end md:self-center">
                        <div className="text-right">
                          <span className="text-xs font-bold text-white block font-['Sora']">
                            {call.duration}
                          </span>
                          <span className="text-[11px] text-white/40 block">
                            {call.date}
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isCompleted
                              ? "bg-[#7ed493]/15 text-[#7ed493] border border-[#7ed493]/30"
                              : isTerminated
                              ? "bg-[#ff8c73]/15 text-[#ff8c73] border border-[#ff8c73]/30"
                              : "bg-white/10 text-white/60 border border-white/10"
                          }`}
                        >
                          {call.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeCategory === "notifications" && (
            <div className="relative z-10 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-white font-['Sora']">Notifications</h2>
              <p className="text-sm text-white/50">
                Choose when and how InterChat alerts you about hub broadcasts, mod logs, and text calls.
              </p>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 text-xs text-white/70">
                Notification preferences will sync across all your connected Discord servers.
              </div>
            </div>
          )}

          {activeCategory === "appearance" && (
            <div className="relative z-10 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-white font-['Sora']">Appearance</h2>
              <p className="text-sm text-white/50">
                Customize your dashboard theme, density, and animation preferences.
              </p>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 text-xs text-white/70">
                Theme is locked to InterChat Night for maximum clarity and contrast.
              </div>
            </div>
          )}

          {activeCategory === "bot_config" && (
            <div className="relative z-10 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-white font-['Sora']">Global Bot Configuration</h2>
              <p className="text-sm text-white/50">
                Global defaults applied across new server link requests and hub connections.
              </p>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 text-xs text-white/70">
                Default message relays, webhook timeouts, and rate limits are managed here.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
