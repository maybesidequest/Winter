import type { CardProps } from "antd";
import { Card, Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";

const { Text } = Typography;

export const dashboardGlassCardStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#13141f",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 3px 0 0 rgba(255, 255, 255, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.55)",
};

const dashboardGlassCardStyles: NonNullable<CardProps["styles"]> = {
  header: { borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "grab" },
  body: { flex: 1, overflowY: "auto" },
};

export function DashboardSectionTitle({ children }: { children: ReactNode }) {
  return (
    <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {children}
    </Text>
  );
}

export function DashboardReadOnlyNotice({
  message = "You can view this Hub setting, but only an authorized manager can change it.",
}: {
  message?: string;
}) {
  return (
    <div role="status" className="mb-4 rounded-xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs text-sky-100">
      View only · {message}
    </div>
  );
}

export function DashboardSectionCard({ style, styles, ...props }: CardProps) {
  return (
    <Card
      variant="borderless"
      style={{ ...dashboardGlassCardStyle, ...style }}
      styles={{ ...dashboardGlassCardStyles, ...styles }}
      {...props}
    />
  );
}

export function DashboardDangerCard({ style, styles, ...props }: CardProps) {
  return (
    <Card
      variant="borderless"
      style={{
        ...dashboardGlassCardStyle,
        background: "rgba(239, 68, 68, 0.05)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        boxShadow: "0 3px 0 0 rgba(239, 68, 68, 0.2), 0 8px 24px -4px rgba(0, 0, 0, 0.55)",
        ...style,
      }}
      styles={{
        ...dashboardGlassCardStyles,
        header: { borderBottom: "1px solid rgba(239, 68, 68, 0.2)", cursor: "grab" },
        ...styles,
      }}
      {...props}
    />
  );
}

export { DepthToggle, type DepthToggleProps } from "./DepthToggle";
