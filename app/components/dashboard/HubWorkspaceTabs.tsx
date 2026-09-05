import { HubAnnouncementsPanel } from "~/components/dashboard/HubAnnouncementsPanel";
import { HubAuditPanel } from "~/components/dashboard/HubAuditPanel";
import { HubChatExperiencePanel } from "~/components/dashboard/HubChatExperiencePanel";
import { HubInvitesPanel } from "~/components/dashboard/HubInvitesPanel";
import { HubLoggingPanel } from "~/components/dashboard/HubLoggingPanel";
import { HubOverview } from "~/components/dashboard/HubOverview";
import { HubRoutes } from "~/components/dashboard/HubRoutes";
import { HubRulesPanel } from "~/components/dashboard/HubRulesPanel";
import { HubSettings } from "~/components/dashboard/HubSettings";
import { HubTeamPanel } from "~/components/dashboard/HubTeamPanel";
import { HubModerationPanel } from "~/components/dashboard/HubModerationPanel";
import type { HubConnectionResource } from "~/resources/connection";
import type { HubResource } from "~/resources/hub";
import type { PatchHubConfigInput } from "~/schemas/hub";
import type { LifecycleFailure } from "~/components/dashboard/HubLifecyclePanel";
import type { LifecycleAction } from "~/services/lifecycleIntent";
import type { PermissionAction } from "~/permissions/config";

interface HubWorkspaceTabsProps {
  activeTab: string;
  hub: HubResource;
  connections: HubConnectionResource[];
  canEdit: boolean;
  canManageConnections: boolean;
  isOwner: boolean;
  canLockdown: boolean;
  isSaving: boolean;
  saveError?: string;
  isRoutePending: boolean;
  onSaveConfig: (changes: Partial<PatchHubConfigInput>) => void;
  onToggleRoute: (conn: HubConnectionResource) => void;
  onDisconnectRoute: (conn: HubConnectionResource) => void;
  onToggleModuleFlag: (flag: string, enabled: boolean) => void;
  pendingLifecycleAction?: LifecycleAction;
  lifecycleFailure?: LifecycleFailure;
  onLockdownHub: (locked: boolean, reason: string) => void;
  onDeleteHub: (confirmationName: string) => void;
  onTransferOwnership: (newOwnerId: string) => void;
  onRefreshLifecycle: () => void;
  onRetryLifecycle: () => void;
  onBackToHubs: () => void;
}

export function HubWorkspaceTabs({
  activeTab,
  hub,
  connections,
  canEdit,
  canManageConnections,
  isOwner,
  canLockdown,
  isSaving,
  saveError,
  isRoutePending,
  onSaveConfig,
  onToggleRoute,
  onDisconnectRoute,
  onToggleModuleFlag,
  onDeleteHub,
  onTransferOwnership,
  pendingLifecycleAction,
  lifecycleFailure,
  onLockdownHub,
  onRefreshLifecycle,
  onRetryLifecycle,
  onBackToHubs,
}: HubWorkspaceTabsProps) {
  const can = (...actions: PermissionAction[]) => actions.some((action) => hub.metadata.permissions[action] === true);
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
        <HubModerationPanel
          hub={hub}
          canEdit={canEdit || can("MANAGE_HUB_SETTINGS")}
          onSaveConfig={onSaveConfig}
          isSaving={isSaving}
        />
      );
    case "rules":
      return <HubRulesPanel hub={hub} canEdit={isOwner || can("MANAGE_RULES")} />;
    case "audit":
      return <HubAuditPanel hub={hub} />;
    case "chat":
    case "modules":
    case "badges":
      return (
        <div className="max-w-4xl">
          <HubChatExperiencePanel
            hub={hub}
            canEdit={canEdit}
            isSaving={isSaving}
            onToggleFlag={onToggleModuleFlag}
          />
        </div>
      );
    case "settings":
      return (
        <HubSettings
          hub={hub}
          canEdit={canEdit}
          isOwner={isOwner}
          canLockdown={canLockdown}
          saving={isSaving}
          onSave={onSaveConfig}
          onDeleteHub={onDeleteHub}
          onTransferOwnership={onTransferOwnership}
          pendingLifecycleAction={pendingLifecycleAction}
          lifecycleFailure={lifecycleFailure}
          onLockdownHub={onLockdownHub}
          onRefreshLifecycle={onRefreshLifecycle}
          onRetryLifecycle={onRetryLifecycle}
          onBackToHubs={onBackToHubs}
        />
      );
    case "logging":
      return (
        <div className="max-w-4xl">
          <HubLoggingPanel hub={hub} connections={connections} canEdit={can("MANAGE_LOGS", "MANAGE_HUB_SETTINGS")} />
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
