export interface MockUser {
  id: string;
  name: string;
  username: string;
  tag: string;
  email: string;
  avatarUrl: string;
  isStaff: boolean;
  role: string;
  serversCount: number;
  hubsCount: number;
  joinedDate: string;
}

export interface MockHub {
  id: string;
  name: string;
  tag: string;
  icon: string;
  color: string;
  memberCount: number;
  serverCount: number;
  description: string;
  category: string;
  locked: boolean;
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
}

export interface MockServer {
  id: string;
  name: string;
  icon: string;
  color: string;
  memberCount: number;
  health: "healthy" | "warning" | "offline";
  latency: string;
  channels: number;
  botInstalled: boolean;
  callCount: number;
  region: string;
  uptime: string;
}

export interface MockActivity {
  id: string;
  type: "broadcast" | "call" | "join" | "automod" | "call_ended";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  serverName: string;
  badgeColor?: string;
}

export interface MockCallHistory {
  id: string;
  caller: string;
  callerIcon: string;
  receiver: string;
  receiverIcon: string;
  hub: string;
  duration: string;
  date: string;
  status: "completed" | "terminated" | "missed";
  messages: number;
  rating?: number | null;
}

export const mockCurrentUser: MockUser = {
  id: "user_01HXYZ890123",
  name: "Alex",
  username: "alex",
  tag: "alex#0001",
  email: "alex@interchat.gg",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  isStaff: true,
  role: "Hub Owner & Moderator",
  serversCount: 12,
  hubsCount: 3,
  joinedDate: "February 2026",
};

export const mockHubs: MockHub[] = [
  {
    id: "hub-1",
    name: "Global Lounge",
    tag: "GLOBAL",
    icon: "🌐",
    color: "#5b4ccb",
    memberCount: 3840,
    serverCount: 18,
    description: "The primary cross-server hangout for general chat and community networking.",
    category: "Community",
    locked: false,
    visibility: "PUBLIC",
  },
  {
    id: "hub-2",
    name: "Tech & Code",
    tag: "DEV",
    icon: "💻",
    color: "#2a7198",
    memberCount: 1920,
    serverCount: 8,
    description: "Developer discussions, code reviews, architecture topics, and programming banter.",
    category: "Technology",
    locked: false,
    visibility: "PUBLIC",
  },
  {
    id: "hub-3",
    name: "Gaming Nexus",
    tag: "GAME",
    icon: "🎮",
    color: "#b44c3d",
    memberCount: 2450,
    serverCount: 11,
    description: "Multi-server gaming lobbies, scrim matches, and party matchmaking.",
    category: "Gaming",
    locked: false,
    visibility: "PUBLIC",
  },
  {
    id: "hub-4",
    name: "Creator Studio",
    tag: "ART",
    icon: "🎨",
    color: "#477353",
    memberCount: 860,
    serverCount: 5,
    description: "Digital artists, designers, and creators sharing works in progress.",
    category: "Creative",
    locked: false,
    visibility: "UNLISTED",
  },
];

export const mockServers: MockServer[] = [
  {
    id: "srv-1",
    name: "Garden Guild",
    icon: "🌿",
    color: "#477353",
    memberCount: 1420,
    health: "healthy",
    latency: "18ms",
    channels: 4,
    botInstalled: true,
    callCount: 34,
    region: "US-East",
    uptime: "99.98%",
  },
  {
    id: "srv-2",
    name: "Anime Club",
    icon: "⛩️",
    color: "#b44c3d",
    memberCount: 890,
    health: "healthy",
    latency: "24ms",
    channels: 2,
    botInstalled: true,
    callCount: 52,
    region: "US-West",
    uptime: "99.95%",
  },
  {
    id: "srv-3",
    name: "TypeScript Devs",
    icon: "🔷",
    color: "#2a7198",
    memberCount: 3200,
    health: "healthy",
    latency: "15ms",
    channels: 6,
    botInstalled: true,
    callCount: 19,
    region: "EU-Central",
    uptime: "100%",
  },
  {
    id: "srv-4",
    name: "Indie Hackers",
    icon: "🚀",
    color: "#5b4ccb",
    memberCount: 1150,
    health: "healthy",
    latency: "22ms",
    channels: 3,
    botInstalled: true,
    callCount: 41,
    region: "US-East",
    uptime: "99.91%",
  },
  {
    id: "srv-5",
    name: "Pixel Den",
    icon: "👾",
    color: "#8175ee",
    memberCount: 670,
    health: "warning",
    latency: "142ms",
    channels: 2,
    botInstalled: true,
    callCount: 15,
    region: "AP-East",
    uptime: "98.40%",
  },
  {
    id: "srv-6",
    name: "Vapor Lounge",
    icon: "🌆",
    color: "#ff8c73",
    memberCount: 930,
    health: "healthy",
    latency: "29ms",
    channels: 3,
    botInstalled: true,
    callCount: 28,
    region: "US-Central",
    uptime: "99.99%",
  },
  {
    id: "srv-7",
    name: "Cozy Corner",
    icon: "☕",
    color: "#cfe8d4",
    memberCount: 450,
    health: "healthy",
    latency: "31ms",
    channels: 1,
    botInstalled: true,
    callCount: 8,
    region: "EU-West",
    uptime: "99.85%",
  },
  {
    id: "srv-8",
    name: "Synthwave Haven",
    icon: "📻",
    color: "#8fd3ff",
    memberCount: 580,
    health: "healthy",
    latency: "38ms",
    channels: 2,
    botInstalled: true,
    callCount: 12,
    region: "US-East",
    uptime: "99.92%",
  },
];

export const mockDashboardMetrics = {
  activeHubs: 3,
  activeHubsTrend: "+1 this week",
  connectedServers: 12,
  connectedServersTrend: "Across 3 hubs",
  activeCalls: 8,
  activeCallsTrend: "4 in progress",
  messagesToday: "1,240",
  messagesTodayTrend: "+18% from yesterday",
};

export const mockRecentActivities: MockActivity[] = [
  {
    id: "act-1",
    type: "broadcast",
    title: "Broadcast relayed",
    description: "Global Lounge relayed 14 messages to Garden Guild and 11 other servers",
    timestamp: "3m ago",
    icon: "📡",
    serverName: "Garden Guild",
    badgeColor: "#5b4ccb",
  },
  {
    id: "act-2",
    type: "call",
    title: "Call connected",
    description: "Anime Club initiated a 1:1 text call with Pixel Den (#meet-someone)",
    timestamp: "12m ago",
    icon: "⚡",
    serverName: "Anime Club",
    badgeColor: "#8fd3ff",
  },
  {
    id: "act-3",
    type: "join",
    title: "New server linked",
    description: "Indie Hackers joined the Tech & Code hub via invite token",
    timestamp: "34m ago",
    icon: "🔗",
    serverName: "Indie Hackers",
    badgeColor: "#7ed493",
  },
  {
    id: "act-4",
    type: "automod",
    title: "Automod policy triggered",
    description: "Polarizer filtered an explicit image broadcast attempt in Gaming Nexus",
    timestamp: "1h ago",
    icon: "🛡️",
    serverName: "Gaming Nexus",
    badgeColor: "#ff8c73",
  },
  {
    id: "act-5",
    type: "call_ended",
    title: "Call concluded",
    description: "Vapor Lounge and Cozy Corner concluded a 28-minute call with 72 messages",
    timestamp: "2h ago",
    icon: "📞",
    serverName: "Vapor Lounge",
    badgeColor: "#8175ee",
  },
];

export const mockCallHistory: MockCallHistory[] = [
  {
    id: "call-1",
    caller: "Garden Guild",
    callerIcon: "🌿",
    receiver: "Pixel Den",
    receiverIcon: "👾",
    hub: "Global Lounge",
    duration: "14m 22s",
    date: "Today at 2:15 PM",
    status: "completed",
    messages: 48,
    rating: 5,
  },
  {
    id: "call-2",
    caller: "Anime Club",
    callerIcon: "⛩️",
    receiver: "Cozy Corner",
    receiverIcon: "☕",
    hub: "Gaming Nexus",
    duration: "32m 05s",
    date: "Today at 11:40 AM",
    status: "completed",
    messages: 112,
    rating: 5,
  },
  {
    id: "call-3",
    caller: "TypeScript Devs",
    callerIcon: "🔷",
    receiver: "Indie Hackers",
    receiverIcon: "🚀",
    hub: "Tech & Code",
    duration: "4m 12s",
    date: "Yesterday at 8:30 PM",
    status: "terminated",
    messages: 9,
    rating: 3,
  },
  {
    id: "call-4",
    caller: "Vapor Lounge",
    callerIcon: "🌆",
    receiver: "Synthwave Haven",
    receiverIcon: "📻",
    hub: "Global Lounge",
    duration: "19m 50s",
    date: "Yesterday at 3:10 PM",
    status: "completed",
    messages: 64,
    rating: 5,
  },
  {
    id: "call-5",
    caller: "Garden Guild",
    callerIcon: "🌿",
    receiver: "Anime Club",
    receiverIcon: "⛩️",
    hub: "Global Lounge",
    duration: "0m 00s",
    date: "Oct 18, 2026",
    status: "missed",
    messages: 0,
    rating: null,
  },
  {
    id: "call-6",
    caller: "Pixel Den",
    callerIcon: "👾",
    receiver: "Vapor Lounge",
    receiverIcon: "🌆",
    hub: "Gaming Nexus",
    duration: "45m 18s",
    date: "Oct 17, 2026",
    status: "completed",
    messages: 156,
    rating: 5,
  },
];
