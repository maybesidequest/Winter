import {
  FileImageOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
} from "@ant-design/icons";
import React from "react";
import type { HubSafetySettings } from "~/services/control/moderation.shared";

export type SafetySettingKey = keyof HubSafetySettings["spec"];

export interface SafetySettingDefinition {
  key: SafetySettingKey;
  label: string;
  description: string;
}

export interface SafetySettingCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: SafetySettingDefinition[];
}

export const SAFETY_CATEGORIES: SafetySettingCategory[] = [
  {
    id: "content",
    title: "Content & Moderation",
    description: "Filter sensitive content and suppress external links across the Hub.",
    icon: React.createElement(SafetyCertificateOutlined, { className: "text-violet-400" }),
    items: [
      {
        key: "blockNsfw",
        label: "Block NSFW content",
        description: "Automatically filter explicit or adult messages across this Hub.",
      },
      {
        key: "hideLinks",
        label: "Hide external links",
        description: "Conceal URLs posted in relayed messages to prevent malicious redirects.",
      },
    ],
  },
  {
    id: "spam",
    title: "Spam & Invite Protection",
    description: "Safeguard against automated raids and unauthorized server promotion.",
    icon: React.createElement(StopOutlined, { className: "text-[#ff8c73]" }),
    items: [
      {
        key: "spamFilter",
        label: "Automated spam filter",
        description: "Detect and throttle repeated messages, mass mentions, and spam waves.",
      },
      {
        key: "blockInvites",
        label: "Block Discord invites",
        description: "Prevent external Discord server invite links from being advertised.",
      },
    ],
  },
  {
    id: "media",
    title: "Media & Attachments",
    description: "Control rich media, images, GIFs, and file uploads moving between servers.",
    icon: React.createElement(FileImageOutlined, { className: "text-[#8fd3ff]" }),
    items: [
      {
        key: "allowVideos",
        label: "Allow video files",
        description: "Permit MP4 and video uploads to be relayed between connected channels.",
      },
      {
        key: "blockAttachments",
        label: "Block file attachments",
        description: "Disallow images, documents, and general file uploads in relays.",
      },
      {
        key: "blockTenorGifs",
        label: "Block Tenor GIFs",
        description: "Disallow Tenor GIF embed playback in cross-server message relays.",
      },
    ],
  },
];

export const ALL_SAFETY_KEYS: SafetySettingKey[] = SAFETY_CATEGORIES.flatMap((c) =>
  c.items.map((i) => i.key)
);

