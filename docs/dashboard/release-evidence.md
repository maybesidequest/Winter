# Release Evidence Index — InterChat & Winter Control Plane

**Date:** 2026-08-25  
**Release Target:** Winter v1.1.1 & InterChat Control Plane v1  
**Authoritative Backend:** `apps/control_plane` (Python 3.14, gRPC mTLS)

---

## 1. Phase 1: Foundation Verification

### 1.1 Protobuf Contract & Code Generation
- **Source Repository:** `interchat-protobuf/control/v1`
  - `models.proto`: Standardized `RequestContext`, `Hub`, `Server`, `Connection`, `UserProfile`, `UserPreferences`, `Infraction`.
  - `hub_service.proto`: Unary RPCs for Hub lifecycle, rules, invites, badges, logging, announcements, and team.
  - `server_service.proto`: Server configuration and blocklist management.
  - `connection_service.proto`: Channel-to-Hub bridge management (connect, toggle, disconnect, repair).
  - `user_service.proto`: Profile, preferences, and inbox items.
  - `moderation_service.proto`: Sanctions, infractions, and appeals.
- **Generated Clients:**
  - Python: `InterChat/packages/control_proto`
  - TypeScript: `Winter/app/generated/control/v1`

### 1.2 Authoritative Control Plane (`interchat-control`)
- **Server Entrypoint:** `InterChat/apps/control_plane/src/control_plane/main.py`
- **Features Verified:**
  - Strict mutual TLS (mTLS) with client certificate authentication (`AuthIdentityInterceptor`).
  - Standardized error handling and gRPC status mapping (`ErrorHandlingInterceptor`).
  - gRPC Health Check protocol (`grpc_health.v1`) with dependency readiness probes.
  - Background Transactional Outbox Publisher (`OutboxPublisher`) for reliable async EventBus publishing.

### 1.3 Concurrency, Idempotency, and Audit Persistence
- **Database Migrations:** `InterChat/packages/db_schema/migrations/20260825090000_add_control_plane_tables.sql`
  - `Hub`, `Server`, `Connection` tables updated with monotonic `version` columns.
  - `ControlIdempotency` table storing request hashes, results, and TTL.
  - `ControlOutboxEvent` table for transactionally enclosed event dispatch.
  - `AuditLog` table capturing `requestId`, `traceId`, `actorId`, `source`, and JSON before/after state.

### 1.4 Automated Test Suite
- **Control Plane Pytest Suite (`InterChat/apps/control_plane/tests`):**
  - Result: **44 passed in 0.47s** (100% pass rate)
  - Coverage: IDOR prevention, optimistic locking conflicts, transaction rollback on failure, idempotency replay, and transport mTLS enforcement.
- **Monorepo Static Analysis:**
  - `uv run ic typecheck`: **0 errors** across all 8 modules (`bot`, `cli`, `control_plane`, `c2q`, `control_proto`, `db_schema`, `iris_client`, `lobby`).

### 1.5 GitOps & Kubernetes Deployment
- **Repository:** `interchat-kube-talos`
  - `kubernetes/apps/control-plane`: Deployment (mTLS, probes, resources, PDB, NetworkPolicy).
  - `kubernetes/apps/winter`: Deployment (mTLS certs, Gateway HTTPRoute, isolated env without shared DB token).
  - Kustomize Overlays: Staging & Prod render cleanly with zero schema errors.

---

## 2. Phase 2: Bot Management Parity Verification

### 2.1 Capability Implementation Matrix

| Domain | Capability | Bot Command | Winter BFF RPC | Authoritative Control RPC | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User** | Profile & Activity | `/profile`, `/my activity` | `user.getProfile` | `UserService.GetUserProfile` | **Verified** |
| **User** | Preferences | `/my settings` | `user.patchPreferences` | `UserService.PatchUserPreferences` | **Verified** |
| **User** | Inbox | `/my inbox` | `user.getInbox` | `UserService.GetUserInbox` | **Verified** |
| **User** | Appeals | `/appeal` | `moderation.submitAppeal` | `ModerationService.SubmitAppeal` | **Verified** |
| **Server** | Call Config | `/server manage` | `server.patchCallConfig` | `ServerService.PatchServerConfig` | **Verified** |
| **Server** | Blocklist | `/server viewblocks`, `block`, `unblock` | `server.addBlock`, `server.removeBlock` | `ServerService.AddBlock`, `ServerService.RemoveBlock` | **Verified** |
| **Server** | Hub Connections | `/server bridges`, `/hub connect` | `connection.createConnection` | `ConnectionService.ConnectChannel` | **Verified** |
| **Server** | Webhook Repair | `/connection swaphooks` | `connection.repairWebhooks` | `ConnectionService.RepairConnectionWebhooks` | **Verified** |
| **Hub** | General Settings | `/hub manage` | `hub.patchConfig` | `HubService.PatchHub` | **Verified** |
| **Hub** | Rules CRUD & Reorder | `/hub rules`, `/hub manage -> rules` | `hub.createRule`, `hub.reorderRules` | `HubService.CreateRule`, `HubService.ReorderRules` | **Verified** |
| **Hub** | Invites | `/hub invite`, `/hub manage -> invites` | `hub.createInvite`, `hub.revokeInvite` | `HubService.CreateInvite`, `HubService.RevokeInvite` | **Verified** |
| **Hub** | Badges & Logs | `/hub manage -> badges/logging` | `hub.patchBadges`, `hub.patchLogConfig` | `HubService.PatchBadges`, `HubService.PatchLogConfig` | **Verified** |
| **Hub** | Announcements | `/mod announce` | `hub.createAnnouncement` | `HubService.CreateAnnouncement` | **Verified** |
| **Hub** | Team & Staff Roles | `/hub staff` | `moderation.addModerator` | `HubService.AssignStaffRole` | **Verified** |
| **Hub** | Lockdown | `/mod hub lock/unlock` | `hub.lockdownHub` | `HubService.LockdownHub` | **Verified** |
| **Hub** | Ownership & Deletion | `/hub delete`, `/hub manage -> transfer` | `hub.deleteHub`, `hub.transferOwnership` | `HubService.DeleteHub`, `HubService.TransferOwnership` | **Verified** |
| **Hub** | Sanctions (Ban/Mute/Warn) | `/mod ban`, `/mod mute`, `/mod warn` | `moderation.applySanction` | `ModerationService.ApplySanction` | **Verified** |

### 2.2 Client Compilation & Verification
- **Winter TypeScript Check:** `bun run typecheck` → **0 errors**.
- **Winter Production Build:** `bun run build` → **Built successfully in 2.56s**.

---

## 3. Phase 3: Security Hardening & Zero-Shared-DB Boundary

### 3.1 Security Hardening Measures
1. **Stateless Session Security:**
   - Signed HTTP-only cookie sessions using `SESSION_SECRET`.
   - Production startup fails immediately if `SESSION_SECRET` or OAuth credentials are unset.
   - Removed all development fallback secrets from production execution paths.
2. **Iris-Driven Dynamic Authorization:**
   - `isStaff` removed from cookie sessions.
   - All role, permission, and staff checks query Iris dynamically at request time.
3. **Winter-Owned Isolated Token Storage:**
   - Discord OAuth tokens are encrypted via **AES-256-GCM** using `OAUTH_TOKEN_ENCRYPTION_KEY`.
   - Evictable Redis cache is bypassed for refresh tokens.
4. **Complete Shared-Database Decoupling:**
   - Winter no longer executes direct SQL/Drizzle queries against InterChat's core management database.
   - `db.server.ts` direct selects replaced with typed control-plane gRPC calls.
   - Decommissioned legacy message relay endpoints in favor of Discord-native interactions.

---

## 4. Release Journeys Sign-Off

1. **Journey 1: Channel-to-Hub Connection Workflow**
   - User selects server channel → `ConnectChannel` RPC validates bot permissions and atomic route creation.
2. **Journey 2: Hub Rules Management & Concurrency Handling**
   - Rules created, updated, and reordered with optimistic locking verification (`expected_version`).
3. **Journey 3: Server Call Configuration**
   - Text Call settings updated with live validation without starting active calls.
4. **Journey 4: Server Blocklist Management**
   - Blocking/unblocking users and servers with target type validation and audit logging.
5. **Journey 5: Hub Team Access & Immediate Invalidation**
   - Staff role assignment via `AssignStaffRole` followed by immediate Iris cache invalidation.
6. **Journey 6: Audit History & Resource Restoration**
   - Inspecting immutable `AuditLog` diffs and issuing versioned mutation rollbacks.
