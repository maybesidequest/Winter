export * from "./types";
import { hubCrudService } from "./crud";
import { hubRulesService } from "./rules";
import { hubInvitesService } from "./invites";
import { hubBadgesLogsService } from "./badges_logs";
import { hubAnnouncementsService } from "./announcements";
import { hubStaffService } from "./staff";
import { hubAuditService } from "./audit";

export const hubService = {
  ...hubCrudService,
  ...hubRulesService,
  ...hubInvitesService,
  ...hubBadgesLogsService,
  ...hubAnnouncementsService,
  ...hubStaffService,
  ...hubAuditService,
};
