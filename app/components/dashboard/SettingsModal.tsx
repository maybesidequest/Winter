import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  SettingsMiniSidebar,
  type SettingsCategory,
} from "./SettingsMiniSidebar";
import { orpc } from "~/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { AccountSection } from "./settings/AccountSection";
import { PreferencesSection } from "./settings/PreferencesSection";
import { AppearanceSection } from "./settings/AppearanceSection";
import { CallHistorySection } from "./settings/CallHistorySection";
import { BotConfigSection } from "./settings/BotConfigSection";
import { BillingSection } from "./settings/BillingSection";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("account");

  const { data: userResource, isLoading: userLoading } = useQuery({
    ...orpc.user.get.queryOptions(),
    enabled: isOpen,
  });

  const { data: locales = [] } = useQuery({
    ...orpc.user.locales.queryOptions(),
    enabled: isOpen,
  });

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none"
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
        className="relative w-full max-w-4xl h-[620px] max-h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row border animate-fadeIn"
        style={{
          background: "#13141f",
          borderColor: "rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
        <div className="flex-1 p-5 sm:p-7 md:p-8 overflow-y-auto dark-scrollbar flex flex-col gap-6 relative">
          <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />

          {activeCategory === "account" && (
            <AccountSection
              userResource={userResource}
              isLoading={userLoading}
            />
          )}

          {activeCategory === "preferences" && (
            <PreferencesSection
              userResource={userResource}
              locales={locales}
              isLoading={userLoading}
            />
          )}

          {activeCategory === "appearance" && (
            <AppearanceSection
              userResource={userResource}
              isLoading={userLoading}
            />
          )}

          {activeCategory === "calls" && (
            <CallHistorySection
              isLoadingUser={userLoading}
            />
          )}

          {activeCategory === "bot_config" && (
            <BotConfigSection
              userResource={userResource}
              isLoading={userLoading}
            />
          )}

          {activeCategory === "billing" && (
            <BillingSection
              userResource={userResource}
              isLoading={userLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
