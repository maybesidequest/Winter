import {
  AlertOutlined,
  AuditOutlined,
  ClusterOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type { HubLogConfig } from "~/services/control/hubs/types";

export type LogCategory = "all" | "moderation" | "community" | "security";

export type LogStreamKey =
  | "modLogs"
  | "appeals"
  | "safetyAlerts"
  | "joinLeaves"
  | "messageModeration"
  | "reports"
  | "networkAlerts";

export interface LogStreamMeta {
  key: LogStreamKey;
  title: string;
  description: string;
  category: "moderation" | "community" | "security";
  channelField: keyof HubLogConfig;
  roleField: keyof HubLogConfig;
  icon: ReactNode;
}

export interface StreamValues {
  channelId: string;
  roleId: string;
  serverId: string;
}

export type StreamsMap = Record<LogStreamKey, StreamValues>;

export const INITIAL_STREAMS_MAP: StreamsMap = {
  modLogs: { channelId: "", roleId: "", serverId: "" },
  appeals: { channelId: "", roleId: "", serverId: "" },
  safetyAlerts: { channelId: "", roleId: "", serverId: "" },
  joinLeaves: { channelId: "", roleId: "", serverId: "" },
  messageModeration: { channelId: "", roleId: "", serverId: "" },
  reports: { channelId: "", roleId: "", serverId: "" },
  networkAlerts: { channelId: "", roleId: "", serverId: "" },
};

export const LOG_STREAMS: LogStreamMeta[] = [
  {
    key: "modLogs",
    title: "Moderation Logs",
    description: "Audit trail for warnings, mutes, kicks, bans, and staff actions.",
    category: "moderation",
    channelField: "modLogsChannelId",
    roleField: "modLogsRoleId",
    icon: <AuditOutlined className="text-sm text-violet-400" />,
  },
  {
    key: "appeals",
    title: "Member Appeals",
    description: "Direct notifications for user ban appeals and disciplinary reviews.",
    category: "moderation",
    channelField: "appealsChannelId",
    roleField: "appealsRoleId",
    icon: <FileTextOutlined className="text-sm text-sky-400" />,
  },
  {
    key: "safetyAlerts",
    title: "Safety & Trust Alerts",
    description: "Proactive warnings for raid detection, spam floods, and high-risk accounts.",
    category: "moderation",
    channelField: "safetyAlertsChannelId",
    roleField: "safetyAlertsRoleId",
    icon: <AlertOutlined className="text-sm text-amber-400" />,
  },
  {
    key: "joinLeaves",
    title: "Joins & Leaves",
    description: "Notifications when connected servers link, unlink, or pause relay channels.",
    category: "community",
    channelField: "joinLeavesChannelId",
    roleField: "joinLeavesRoleId",
    icon: <TeamOutlined className="text-sm text-emerald-400" />,
  },
  {
    key: "messageModeration",
    title: "Message Moderation",
    description: "Real-time records of deleted, edited, or automated automod filter drops.",
    category: "community",
    channelField: "messageModerationChannelId",
    roleField: "messageModerationRoleId",
    icon: <MessageOutlined className="text-sm text-indigo-400" />,
  },
  {
    key: "reports",
    title: "Member Reports",
    description: "Alerts when members flag cross-posted content for staff attention.",
    category: "community",
    channelField: "reportsChannelId",
    roleField: "reportsRoleId",
    icon: <ExclamationCircleOutlined className="text-sm text-rose-400" />,
  },
  {
    key: "networkAlerts",
    title: "Network Alerts",
    description: "System diagnostics for delivery drops, latency spikes, and webhook errors.",
    category: "security",
    channelField: "networkAlertsChannelId",
    roleField: "networkAlertsRoleId",
    icon: <ClusterOutlined className="text-sm text-teal-400" />,
  },
];

export const CATEGORY_TABS: Array<{ key: LogCategory; label: string; count: number }> = [
  { key: "all", label: "All Streams", count: 7 },
  { key: "moderation", label: "Moderation", count: 3 },
  { key: "community", label: "Community", count: 3 },
  { key: "security", label: "Network", count: 1 },
];

export function parseConfigToStreams(
  data: HubLogConfig | undefined,
  defaultServer: string,
  existing?: StreamsMap
): StreamsMap {
  if (!data) return INITIAL_STREAMS_MAP;
  const next = { ...INITIAL_STREAMS_MAP };
  for (const s of LOG_STREAMS) {
    const rawCh = (data[s.channelField] as string) || (s.key === "modLogs" ? data.channelId : "") || "";
    const rawRole = (data[s.roleField] as string) || (s.key === "modLogs" ? data.notificationRoleId : "") || "";
    next[s.key] = {
      channelId: rawCh,
      roleId: rawRole,
      serverId: existing?.[s.key]?.serverId || defaultServer,
    };
  }
  return next;
}

