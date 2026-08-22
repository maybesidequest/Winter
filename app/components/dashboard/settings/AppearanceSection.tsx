import { MoonOutlined, SunOutlined, DesktopOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { DepthToggle } from "~/components/dashboard/shared";
import type { UserResource } from "~/resources/user";
import { orpc } from "~/lib/orpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AppearanceSectionProps {
  userResource?: UserResource;
  isLoading?: boolean;
}

type ThemeChoice = "system" | "night" | "paper";

function resolvedTheme(choice: ThemeChoice): "night" | "paper" {
  if (choice !== "system") return choice;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "paper";
}

export function AppearanceSection({ userResource, isLoading }: AppearanceSectionProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    orpc.user.patchDashboardPreferences.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.user.get.queryOptions().queryKey });
      },
    })
  );

  const spec = userResource?.spec;
  const currentTheme = (spec?.theme || "system") as ThemeChoice;

  const handleThemeChange = (value: ThemeChoice) => {
    localStorage.setItem("interchat-dashboard-theme-choice", value);
    const resolved = resolvedTheme(value);
    localStorage.setItem("interchat-dashboard-theme", resolved);
    document.documentElement.dataset.dashboardTheme = resolved;
    window.dispatchEvent(new CustomEvent("interchat-dashboard-theme", { detail: resolved }));
    mutation.mutate({ theme: value });
  };

  const handleToggle = (key: "compactMode" | "reducedMotion" | "soundAlerts", value: boolean) => {
    mutation.mutate({ [key]: value });
  };

  if (isLoading || !userResource) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        <div className="h-24 rounded-2xl bg-white/5 border border-white/10" />
        <div className="h-16 rounded-2xl bg-white/5 border border-white/10" />
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col gap-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Sora'] tracking-tight">
          Appearance & Display
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-0.5">
          Customize the dashboard theme, layout density, and animation behavior.
        </p>
      </div>

      {/* Theme Picker */}
      <div
        className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          background: "#13141f",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.5)",
        }}
      >
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white">Interface Theme</h4>
          <p className="text-[11px] text-white/50">Select your preferred color contrast palette.</p>
        </div>
        <Segmented
          value={currentTheme}
          onChange={(val) => handleThemeChange(val as ThemeChoice)}
          options={[
            { label: <span className="flex items-center gap-1.5"><DesktopOutlined /> System</span>, value: "system" },
            { label: <span className="flex items-center gap-1.5"><MoonOutlined /> Night</span>, value: "night" },
            { label: <span className="flex items-center gap-1.5"><SunOutlined /> Paper</span>, value: "paper" },
          ]}
        />
      </div>

      {/* Display Options */}
      <div className="flex flex-col gap-2.5">
        {[
          {
            id: "compactMode",
            title: "Compact Density Mode",
            desc: "Reduce row paddings and spacing to display more information on screen.",
            checked: spec?.compactMode ?? false,
            onChange: (checked: boolean) => handleToggle("compactMode", checked),
          },
          {
            id: "reducedMotion",
            title: "Reduced Motion",
            desc: "Minimize background glow shaders and transient transition animations.",
            checked: spec?.reducedMotion ?? false,
            onChange: (checked: boolean) => handleToggle("reducedMotion", checked),
          },
          {
            id: "soundAlerts",
            title: "Audio & Ringing Cues",
            desc: "Play subtle auditory alerts when new lobby connections and broadcasts arrive.",
            checked: spec?.soundAlerts ?? true,
            onChange: (checked: boolean) => handleToggle("soundAlerts", checked),
          },
        ].map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3"
            style={{
              background: "#13141f",
              borderColor: "rgba(255, 255, 255, 0.08)",
              boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.4)",
            }}
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                {item.title}
              </span>
              <span className="text-[11px] text-white/50 mt-0.5 leading-snug">
                {item.desc}
              </span>
            </div>
            <DepthToggle
              checked={item.checked}
              onChange={item.onChange}
              aria-label={item.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
