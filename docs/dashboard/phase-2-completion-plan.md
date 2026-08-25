# Phase 2 Completion Plan: Parity, Cutover, and Security

Status: execution plan. This document does not claim any capability is complete.

Read first:

- `docs/dashboard/phase-1-foundation.md`
- `docs/dashboard/phase-2-bot-parity.md`
- `docs/dashboard/phase-2-capability-matrix.md`

## 1. Required outcome

Phase 2 is complete only when every included management capability works through one Control Plane implementation from both Discord Bot and Winter.

```text
Discord Bot UI ----\
                    > Control Plane -> InterChat management DB
Winter ORPC BFF ---/                  -> Iris / Discord / outbox workers
```

Hard boundaries:

- Control Plane owns all InterChat management reads and writes.
- Winter has no InterChat DB credentials, schema imports, Drizzle management models, or Discord bot token.
- Bot commands and components contain presentation logic only. They never retain a fallback management writer.
- Control Plane authorizes every query and mutation at execution time. Winter or Bot checks never replace service-side checks.
- Starting Calls, reporting messages, and viewing message info remain Discord-only.
- Billing stays absent.
- A visible tab must work end to end. Hide incomplete tabs behind a disabled-by-default capability flag.

## 2. Rules for implementing this plan

1. Work in listed order. Later packets depend on earlier ones.
2. Complete one capability slice at a time: contract -> handler -> Bot -> Winter -> tests -> cutover -> delete old path.
3. Never edit generated protobuf files. Edit `.proto`, run canonical generator, commit generated outputs.
4. Never invent placeholder values, fake inbox items, fake health, or success responses.
5. Never catch a Control Plane failure and write directly to DB. Return typed failure.
6. Never accept `hub_id`, `server_id`, `channel_id`, `user_id`, or child resource ID without checking actor access and parent ownership in Control Plane.
7. Never mark matrix row complete from code presence. Attach test and runtime evidence.
8. Keep unrelated dirty changes. Do not reset or rewrite user work.

## 3. Completion states

Use only these matrix states:

- `missing`: contract or handler absent.
- `control-only`: Control Plane exists; clients not cut over.
- `dual-path`: old writer still reachable. This is not complete.
- `bot-on`: Bot uses Control Plane; Winter incomplete.
- `winter-on`: Winter uses Control Plane; Bot incomplete.
- `soaking`: both clients use Control Plane behind flag; old writer disabled.
- `complete`: old writer deleted, tests pass, evidence linked.
- `excluded`: product boundary explicitly excludes capability.

Reset every row currently lacking evidence to `missing`, `control-only`, or `dual-path` before implementation.

## 4. Work packet 0: establish truthful baseline

### Tasks

1. Inventory every included command from `phase-2-bot-parity.md`.
2. For each matrix row, locate:
   - protobuf RPC and resource;
   - Control Plane handler;
   - service-side authorization;
   - Bot entry point;
   - Winter ORPC route and screen;
   - old DB writer;
   - tests and deployment evidence.
3. Change unsupported `complete` claims to truthful states.
4. Add `Evidence` links only for executable tests, deployed config, or recorded staging checks.
5. Hide every visible Winter route whose row is below `winter-on`.

### Acceptance

- Every command maps to one row or an explicit exclusion.
- No row says `complete` without all Definition-of-Done evidence.
- CI fails if a visible route maps to a missing/disabled capability.

## 5. Work packet 1: finish shared mutation machinery

Implement this before adding more mutation handlers.

### 5.1 Request context

Every mutation requires:

- workload principal derived from mTLS certificate;
- actor ID and actor type;
- request ID;
- idempotency key;
- source (`BOT` or `WINTER`);
- trace ID.

Reject missing/invalid values. Ignore client-supplied service principal when it conflicts with certificate identity. Add method-level principal allowlists.

### 5.2 Reusable idempotent mutation executor

Create one application-level component used by every mutation. Do not copy logic into 20 handlers.

Required algorithm:

1. Canonicalize semantic request fields, excluding trace/request IDs.
2. Hash method name + actor + target aggregate + canonical request.
3. Begin DB transaction.
4. Lock/read `ControlIdempotency` by `(service_principal, method, idempotency_key)`.
5. Existing key + different hash -> `ALREADY_EXISTS`/typed idempotency conflict.
6. Existing key + same hash -> return exact stored serialized response and status; run no side effect.
7. Execute authorization and mutation.
8. Write aggregate, audit event, outbox event, and serialized response in same transaction.
9. Commit.
10. Run only approved post-commit nudge; durable worker remains source of retry.

Add a repository protocol to `domain/ports/repositories.py`; application code must depend on protocol, not `*DbRepository`.

### 5.3 Versioning

- Every update/delete accepts `expected_version`.
- Compare it inside locked transaction.
- Return typed conflict containing resource ID, expected version, and current version.
- Create returns version `1`; every successful mutation increments once.
- Winter fetches current version. Never hard-code `1`.

### 5.4 Audit and outbox

Every mutation transaction writes:

- actor, source, action, aggregate ID/version;
- redacted before/after fields;
- request/trace IDs;
- one or more durable outbox events.

Outbox consumer deduplicates by event ID. Retry survives restart. Dead-letter/lag metrics exist.

### Acceptance tests

- same key/same request returns byte-equivalent original response;
- same key/different request fails;
- concurrent same-key calls mutate once;
- stale version changes nothing;
- audit/outbox failure rolls back aggregate;
- publisher failure leaves committed event retryable;
- Python and TypeScript use shared request fixtures.

## 6. Work packet 2: close authorization and IDOR/BOLA gaps

Fix authority before exposing more UI.

### Required checks

| Operation | Mandatory Control Plane check |
| --- | --- |
| Get private/unlisted Hub, rules, staff, announcements | Actor has Hub access; sensitive fields require exact read permission |
| Get Server | Actor can manage requested Discord Server |
| Get Connections by Hub | `MANAGE_CONNECTIONS` or approved read permission on that Hub |
| Get Connections by Server | Discord `MANAGE_GUILD` on that Server |
| Get infractions/audit | `VIEW_LOGS` on requested Hub |
| Connect channel | Actor manages Server/channel; channel belongs to Server; bot can view/send/manage webhooks; actor may join Hub |
| Child mutation | Child row predicate includes requested parent ID |

Rules:

- Require exactly one supported scope when an RPC accepts Hub or Server filters.
- Validate Discord channel `guild_id == server_id`.
- Fail closed when Discord or Iris is unavailable.
- Do not return empty data on authorization/dependency failure.
- Add negative tests for cross-Hub, cross-Server, cross-channel, and cross-child access.

### Acceptance

All known IDOR/BOLA regression tests pass through direct gRPC and Winter ORPC. Trusted workload status never bypasses actor authorization.

## 7. Work packet 3: Hub Team and custom roles

Current assignment RPC is insufficient for Bot custom-role management. Model roles as resources.

### Contract

Add `HubRole` with:

- metadata: role ID, Hub ID, name, created/updated timestamps;
- spec: permissions bitmask, position/rank;
- status: assignment count, protected flag;
- version.

Add RPCs:

- `ListHubRoles`
- `CreateHubRole`
- `PatchHubRole`
- `DeleteHubRole`
- existing `ListStaff`, `AssignStaffRole`, `RemoveStaffRole` updated to use `role_id` and `expected_version`.

### Authorization invariants

- Owner cannot be removed or demoted through staff RPCs.
- Non-owner cannot grant any permission bit they lack.
- Global/system permissions are never grantable through Hub roles.
- Actor must outrank target and assigned role.
- Actor cannot edit/delete a role at or above own rank.
- Role deletion fails while assigned unless request explicitly performs an authorized replacement transaction.
- Permission mask comes from canonical enum; reject unknown/reserved bits.

### Transaction and cache invalidation

Role/assignment mutation, `Hub.authz_version` increment, audit, and outbox insert occur in one transaction. Outbox event names affected Hub/user/role and new authz version. Iris invalidation runs after commit and retries from outbox. Every authorization check rejects cached snapshots older than current Hub authz version.

### Bot cutover

Replace direct writes in:

- `apps/bot/src/bot/domain/hub/ui/layouts/staff.py`
- `apps/bot/src/bot/domain/hub/ui/layouts/configure/settings/permissions.py`
- mutating methods in `apps/bot/src/bot/domain/hub/services/permission_service.py`

Keep read adapters only until matching Control Plane query exists. Then delete direct reads too.

### Winter workflow

- searchable user selector;
- role list/editor;
- effective permission preview;
- disabled controls with required-permission explanation;
- owner/protected role labels;
- confirmation for removal and destructive role edits;
- stale-edit and revocation states.

### Tests

- moderator cannot grant Administrator/global bits;
- moderator cannot remove/edit manager;
- actor cannot assign above own permissions/rank;
- owner remains protected;
- permission revoked immediately after commit even with primed caches;
- failed Iris invalidation retries without rolling DB back;
- Bot and Winter produce equal stored role, audit, and events.

## 8. Work packet 4: Hub invites

### Control Plane

Complete list/create/revoke handlers with Hub access checks, persistent idempotency, audit, version checks, and parent-scoped predicates. Invite code generation occurs only in Control Plane. Create response returns actual code and expiry.

Invite consumption during connection must lock invite, validate expiry/uses, create/reactivate connection, increment use/delete exhausted invite, update counts, audit, and outbox in one transaction.

### Bot cutover

Replace direct invite mutation paths in:

- `apps/bot/src/bot/domain/hub/services/hub_service.py`
- `apps/bot/src/bot/domain/hub/ui/layouts/invite_manager.py`
- `apps/bot/src/bot/domain/hub/cog.py`
- connection helper invite consumption.

Bot displays code returned by Control Plane. No local code generation or direct delete remains.

### Winter

List, create, copy, and revoke. Use duration/max-use controls; never expose private Hub data without access. Show expired/exhausted state.

### Tests

- duplicate create retry returns same code;
- concurrent final-use connections consume once;
- expired/revoked invite fails;
- cross-Hub revoke fails;
- private Hub list requires access;
- Bot/Winter parity.

## 9. Work packet 5: announcements

First decide contract from existing Bot behavior; do not drop scheduling fields to fit current RPC.

### Contract/resource

`HubAnnouncement` must represent content/title as required by product, schedule, recurrence, pause state, delivery status, sent timestamp, author, Hub, and version. Desired schedule belongs in `spec`; delivery result belongs in `status`.

Add/complete RPCs for list, create draft, patch, pause/resume, and delete. Use field masks for patch.

### Control Plane

- require `ANNOUNCE` for management reads and writes;
- validate schedule/recurrence/timezone;
- persist announcement + audit + outbox atomically;
- dispatch only from durable worker;
- deduplicate delivery;
- record observed sent/failure status without rewriting desired spec;
- retry transient failures; expose actionable failure.

### Bot cutover

Replace direct paths in:

- `apps/bot/src/bot/domain/hub/ui/layouts/announce_composer.py`
- `apps/bot/src/bot/domain/hub/ui/layouts/configure/settings/announcements.py`
- `apps/bot/src/bot/domain/hub/services/announcement_service.py`

No direct webhook broadcast from management service. Bot UI calls Control Plane and displays returned state.

### Winter

Draft, preview, schedule, edit, pause/resume, delete. Show timezone, next delivery, last result, loading, empty, conflict, denied, dependency failure, and retry states.

### Tests

- unauthorized list and mutation fail;
- cross-Hub child IDs fail;
- duplicate request schedules once;
- paused item never sends;
- worker retry sends once;
- desired and observed fields remain separated;
- Bot/Winter parity.

## 10. Work packet 6: eliminate remaining Bot writers

For every included matrix row:

1. Search Bot service, cog, layout, helper, event, and task files for SQL writes.
2. Route command/component through typed Control client.
3. Pass actor, source, idempotency key, and fetched version.
4. Remove fallback writer and broad `except` fallback.
5. Keep internal runtime-only writes only when phase docs explicitly assign them to Bot. Document each exception.

Must cover at least:

- Hub general/modules/rules/logging/badges;
- invites/team/announcements;
- connections and maintenance;
- sanctions/records/appeals/lockdown;
- transfer/delete;
- Server prefix/Calls/blocklist;
- user preferences/inbox actions.

Add CI guard that rejects imports or write calls from known Bot presentation paths. Maintain a narrow allowlist for runtime relay/Call state.

## 11. Work packet 7: make Winter a typed, DB-free BFF

### Generated client

- Canonical `buf generate` emits Python and TypeScript from same commit.
- Commit generated TypeScript.
- CI reruns generation and fails on diff.
- Replace dynamic descriptor loading, `Record<string, UnaryMethod<unknown, unknown>>`, `invokeRpc<any>`, free-form enum strings, and hand-written protobuf mirrors.
- Each resource client imports generated request, response, enum, and service types.
- Split files over 200 lines by resource/subresource.

### DB and token boundary

Remove from Winter production runtime:

- InterChat `DATABASE_URL`;
- Discord bot token;
- InterChat schema/Drizzle management tables;
- direct SQL management reads/writes;
- direct Discord bot REST calls.

Winter may use its isolated storage only for web concerns such as encrypted OAuth tokens/session support. Name its credential `WINTER_DATABASE_URL`; it must point to a separate DB and contain no InterChat domain tables. User identity/profile synchronization goes through Control Plane.

### ORPC and UI

- ORPC validates input with shared schemas, adds authenticated actor context, calls typed Control client, and maps typed errors.
- UI never performs permission logic; it renders capabilities returned by service.
- Every form handles loading, empty, denied, validation, stale version, dependency unavailable, partial side-effect, retry, and success.
- Never create a full resource from summary data or fabricate defaults. Fetch full resource before editing.

### CI guards

Fail on:

- `db.server` or InterChat schema imports outside isolated Winter storage;
- `DATABASE_URL` or `DISCORD_TOKEN` in Winter manifests;
- `any` in Control client directory, except documented generator output;
- dynamic proto descriptor loading for Control Plane;
- generated-code diff.

## 12. Work packet 8: finish every parity row

Process rows in this order:

1. Normal-user reads: help, stats, leaderboard, discovery, Hub profile, profile/passport, activity, Hub list.
2. User writes: Hub creation, preferences, inbox actions, feedback, appeals.
3. Server: overview, setup, prefix, Calls config, blocklist.
4. Hub config: general, modules, rules, logging, badges.
5. Invites, Team, announcements, audit.
6. Moderation actions/records, safety settings/assessments, lockdown.
7. Connections: list, pause/resume, repair, disconnect, connect.
8. Ownership transfer and Hub deletion.

For each row, use this exact loop:

1. Write acceptance tests first.
2. Define resource and RPC.
3. Generate clients.
4. Implement authorized Control query/transaction.
5. Add audit/outbox/compensation where required.
6. Add Bot adapter.
7. Add Winter ORPC adapter and workflow.
8. Run contract/parity/security tests.
9. Enable capability in staging for both clients.
10. Soak; inspect errors, audit, outbox lag, and side effects.
11. Delete old writer.
12. Mark matrix `complete` with evidence.

Never bundle multiple incomplete rows and claim percentage from file count.

## 13. Work packet 9: deployment and end-to-end proof

### Automated gates

InterChat:

```bash
uv run ic format
uv run ic lint
uv run ic typecheck
uv run ic test
```

Winter:

```bash
bun run generate:control-types
git diff --exit-code -- app/generated
bun run typecheck
bun run build
bun run test
```

GitOps:

```bash
kubectl kustomize kubernetes/apps/control-plane/overlays/prod >/dev/null
kubectl kustomize kubernetes/apps/winter/overlays/prod >/dev/null
```

### Required integration tests

- Bot and Winter call same staging Control Plane.
- mTLS rejects unknown workload.
- Winter cannot reach InterChat DB by secret or NetworkPolicy.
- Control Plane restart does not lose committed outbox work.
- Iris/Discord/Redis outage fails safely.
- stale concurrent edits show recoverable conflicts.
- channel connection verifies guild/channel ownership and webhook permissions.
- permission revocation takes effect immediately.
- one representative Bot and Winter flow per capability family produces equal resource/audit/event results.

### Browser smoke

Test as normal user, Hub moderator, Hub manager, Hub owner, and Server manager:

- only authorized tabs appear;
- selectors use names, not required snowflakes;
- forms preserve input on recoverable failure;
- keyboard/focus/mobile/loading/empty/error states work;
- contextual Discord-only actions and Billing remain absent;
- every visible save performs a real operation.

Store screenshots, trace/request IDs, and staging audit links in `release-evidence.md`.

## 14. Commit sequence

Use small commits in this order:

1. `docs: reset phase 2 matrix to verified states`
2. `feat(control): add shared idempotent mutation executor`
3. `test(control): cover cross-resource authorization`
4. `feat(contract): model hub roles`
5. `feat(control): implement role and staff transactions`
6. `refactor(bot): cut hub team over to control`
7. `feat(winter): complete hub team workflow`
8. `fix(control): make invite lifecycle transactional`
9. `refactor(bot): cut invites over to control`
10. `feat(winter): complete invite workflow`
11. `feat(contract): complete announcement lifecycle`
12. `feat(control): add durable announcement scheduling`
13. `refactor(bot): cut announcements over to control`
14. `feat(winter): complete announcement workflow`
15. Repeat one commit group per remaining matrix row.
16. `refactor(winter): consume generated control clients only`
17. `security(winter): remove core db and bot credentials`
18. `test: add parity, outage, browser, and deployment gates`
19. `docs: attach phase 2 completion evidence`

Do not combine contract changes, generated output, several capabilities, and unrelated cleanup in one commit.

## 15. Final exit gate

Do not say “Phase 2 complete” until every box is checked:

- [ ] Every included capability row is `complete`; exclusions match product boundary.
- [ ] Every Bot and Winter management mutation reaches Control Plane.
- [ ] No old or fallback management writer remains.
- [ ] Every query and mutation has authoritative IDOR/BOLA checks.
- [ ] Every mutation is persistently idempotent, version-aware, audited, and outbox-backed.
- [ ] Staff rank/permission escalation and revocation-cache tests pass.
- [ ] Invite consumption and connection creation are atomic.
- [ ] Announcement scheduling/delivery is durable and deduplicated.
- [ ] Winter consumes generated types without dynamic/`any` Control transport.
- [ ] Winter has no InterChat DB credential or Discord bot token.
- [ ] Every visible tab and action works; incomplete surfaces are hidden.
- [ ] Full Python, TypeScript, contract, integration, browser, and GitOps checks pass.
- [ ] `phase-2-capability-matrix.md` and `release-evidence.md` contain current proof.

If one box fails, report Phase 2 as incomplete and name failed packet. Never substitute an estimated percentage for exit-gate evidence.
