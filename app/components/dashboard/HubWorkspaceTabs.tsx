import type { HubResource } from "~/resources/hub";
import type { HubConnectionResource } from "~/resources/connection";
import { HubOverview } from "~/components/dashboard/HubOverview";
import { HubSummary } from "~/components/dashboard/HubSummary";
import { HubRoutes } from "~/components/dashboard/HubRoutes";
import { HubRulesPanel } from "~/components/dashboard/HubRulesPanel";
import { HubInvitesPanel } from "~/components/dashboard/HubInvitesPanel";
import { HubBadgesPanel } from "~/components/dashboard/HubBadgesPanel";
import { HubLoggingPanel } from "~/components/dashboard/HubLoggingPanel";
import { HubAnnouncementsPanel } from "~/components/dashboard/HubAnnouncementsPanel";
import { HubTeamPanel } from "~/components/dashboard/HubTeamPanel";
import { HubSettings } from "~/components/dashboard/HubSettings";
import { HubSettingsPanel } from "~/components/dashboard/HubSettingsPanel";
import { HubAuditPanel } from "~/components/dashboard/HubAuditPanel";
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
  const can = (...actions: string[]) => actions.some((action) => hub.metadata.permissions?.[action as keyof typeof hub.metadata.permissions]);
  switch (activeTab) {
    case "overview":
      return <HubSummary hub={hub} />;
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
      return <HubRulesPanel hub={hub} canEdit={can("MANAGE_RULES")} />;
    case "audit":
      return <HubAuditPanel hub={hub} />;
    case "modules":
      return (
        <div className="max-w-4xl">
          <HubSettingsPanel settings={hub.spec.settings} canEdit={canEdit} onToggleFlag={onToggleModuleFlag} />
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
          <HubLoggingPanel hub={hub} canEdit={can("VIEW_LOGS")} />
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
      return <HubSummary hub={hub} />;
  }
}
