import { HubAnnouncementsPanel } from "~/components/dashboard/HubAnnouncementsPanel";
import { HubAuditPanel } from "~/components/dashboard/HubAuditPanel";
import { HubBadgesPanel } from "~/components/dashboard/HubBadgesPanel";
import { HubInvitesPanel } from "~/components/dashboard/HubInvitesPanel";
import { HubLoggingPanel } from "~/components/dashboard/HubLoggingPanel";
import { HubOverview } from "~/components/dashboard/HubOverview";
import { HubRoutes } from "~/components/dashboard/HubRoutes";
import { HubRulesPanel } from "~/components/dashboard/HubRulesPanel";
import { HubSettings } from "~/components/dashboard/HubSettings";
import { HubSettingsPanel } from "~/components/dashboard/HubSettingsPanel";
import { HubTeamPanel } from "~/components/dashboard/HubTeamPanel";
import type { HubConnectionResource } from "~/resources/connection";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";

interface HubWorkspaceTabsProps {
  activeTab: string;
  hub: HubResource;
  connections: HubConnectionResource[];
  canEdit: boolean;
  canManageConnections: boolean;
  isOwner: boolean;
  isSaving: boolean;
  saveError?: string;
  isRoutePending: boolean;
  onSaveConfig: (changes: Partial<PatchHubConfigInput>) => void;
  onToggleRoute: (conn: HubConnectionResource) => void;
  onDisconnectRoute: (conn: HubConnectionResource) => void;
  onToggleModuleFlag: (flag: string, enabled: boolean) => void;
  onDeleteHub: () => void;
  onTransferOwnership: (newOwnerId: string) => void;
}

export function HubWorkspaceTabs({
  activeTab,
  hub,
  connections,
  canEdit,
  canManageConnections,
  isOwner,
  isSaving,
  saveError,
  isRoutePending,
  onSaveConfig,
  onToggleRoute,
  onDisconnectRoute,
  onToggleModuleFlag,
  onDeleteHub,
  onTransferOwnership,
}: HubWorkspaceTabsProps) {
  const can = (...actions: string[]) => {
    const perms = hub.metadata.permissions as any;
    if (!perms) return false;
    if (Array.isArray(perms)) {
      const permMap = Object.fromEntries(
        perms
          .filter((p: any) => p && typeof p === "object" && "key" in p)
          .map((p: any) => [p.key, Boolean(p.value)])
      );
      return actions.some((action) => permMap[action]);
    }
    return actions.some((action) => perms[action]);
  };
  switch (activeTab) {
    case "overview":
    case "general":
      return <HubOverview hub={hub} canEdit={canEdit} saving={isSaving} error={saveError} onSave={onSaveConfig} />;
    case "connections":
      return (
        <HubRoutes
          connections={connections}
          canManage={canManageConnections}
          pending={isRoutePending}
          onToggle={onToggleRoute}
          onDisconnect={onDisconnectRoute}
        />
      );
    case "moderation":
      return (
        <div className="flex flex-col gap-6">
          <HubRulesPanel hub={hub} canEdit={can("MANAGE_RULES")} />
        </div>
      );
    case "rules":
      return <HubRulesPanel hub={hub} canEdit={isOwner || can("MANAGE_RULES")} />;
    case "audit":
      return <HubAuditPanel hub={hub} />;
    case "modules":
      return (
        <div className="max-w-4xl">
          <HubSettingsPanel settings={hub.spec.settings} canEdit={canEdit} isSaving={isSaving} onToggleFlag={onToggleModuleFlag} />
        </div>
      );
    case "settings":
      return (
        <HubSettings
          hub={hub}
          canEdit={canEdit}
          isOwner={isOwner}
          saving={isSaving}
          onSave={onSaveConfig}
          onDeleteHub={onDeleteHub}
          onTransferOwnership={onTransferOwnership}
        />
      );
    case "logging":
      return (
        <div className="max-w-4xl">
          <HubLoggingPanel hub={hub} canEdit={can("MANAGE_LOGS", "MANAGE_HUB_SETTINGS")} />
        </div>
      );
    case "badges":
      return (
        <div className="max-w-4xl">
          <HubBadgesPanel hub={hub} canEdit={canEdit} />
        </div>
      );
    case "invites":
      return (
        <div className="max-w-4xl">
          <HubInvitesPanel hub={hub} canEdit={can("MANAGE_INVITES")} />
        </div>
      );
    case "team":
      return (
        <div className="max-w-4xl">
          <HubTeamPanel hub={hub} canEdit={can("MANAGE_MODERATORS")} />
        </div>
      );
    case "announcements":
      return (
        <div className="max-w-4xl">
          <HubAnnouncementsPanel hub={hub} canEdit={can("ANNOUNCE")} />
        </div>
      );
    default:
      return <HubOverview hub={hub} canEdit={canEdit} saving={isSaving} error={saveError} onSave={onSaveConfig} />;
  }
}
