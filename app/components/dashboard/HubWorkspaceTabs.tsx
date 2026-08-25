import type { HubResource } from "~/resources/hub";
import type { HubConnectionResource } from "~/resources/connection";
import { HubOverview } from "~/components/dashboard/HubOverview";
import { HubSummary } from "~/components/dashboard/HubSummary";
import { HubRoutes } from "~/components/dashboard/HubRoutes";
import { HubSafetyView } from "~/components/dashboard/HubSafetyView";
import { HubRulesPanel } from "~/components/dashboard/HubRulesPanel";
import { HubInvitesPanel } from "~/components/dashboard/HubInvitesPanel";
import { HubBadgesPanel } from "~/components/dashboard/HubBadgesPanel";
import { HubLoggingPanel } from "~/components/dashboard/HubLoggingPanel";
import { HubAnnouncementsPanel } from "~/components/dashboard/HubAnnouncementsPanel";
import { HubTeamPanel } from "~/components/dashboard/HubTeamPanel";
import { HubSettings } from "~/components/dashboard/HubSettings";
import { HubSettingsPanel } from "~/components/dashboard/HubSettingsPanel";
import type { PatchHubConfigInput } from "~/schemas/hub";

interface HubWorkspaceTabsProps {
  activeTab: string;
  hub: HubResource;
  connections: HubConnectionResource[];
  canEdit: boolean;
  canManageConnections: boolean;
  isOwner: boolean;
  isSaving: boolean;
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
  isRoutePending,
  onSaveConfig,
  onToggleRoute,
  onDisconnectRoute,
  onToggleModuleFlag,
  onDeleteHub,
  onTransferOwnership,
}: HubWorkspaceTabsProps) {
  switch (activeTab) {
    case "overview":
      return <HubSummary hub={hub} />;
    case "general":
      return <HubOverview hub={hub} canEdit={canEdit} saving={isSaving} onSave={onSaveConfig} />;
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
          <HubSafetyView hub={hub} canEdit={canEdit} saving={isSaving} onSave={onSaveConfig} />
          <HubRulesPanel hub={hub} canEdit={canEdit} />
        </div>
      );
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
          <HubLoggingPanel hub={hub} canEdit={canEdit} />
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
          <HubInvitesPanel hub={hub} canEdit={canEdit} />
        </div>
      );
    case "team":
      return (
        <div className="max-w-4xl">
          <HubTeamPanel hub={hub} canEdit={canEdit} />
        </div>
      );
    case "announcements":
      return (
        <div className="max-w-4xl">
          <HubAnnouncementsPanel hub={hub} canEdit={canEdit} />
        </div>
      );
    default:
      return <HubSummary hub={hub} />;
  }
}
