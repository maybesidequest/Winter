# Cross-phase release evidence index

This index is the single evidence map for the Phase 1, Phase 2, and Phase 3
release gates. A checkbox is checked only when the linked automated result,
deployment observation, manual QA record, or approved exception exists.

## Phase records

- [Phase 1 evidence](./phase-1-release-evidence.md)
- [Phase 2 evidence](./phase-2-release-evidence.md)
- [Phase 3 specification](./phase-3-release.md)

## Phase 3 artifacts

- [Data-access inventory](./data-access-inventory.md)
- [Authorization matrix](./authorization-matrix.md)
- [Threat model](./threat-model.md)
- [Journey map](./journey-map.md)
- [Test matrix](./test-matrix.md)
- [Operations pack](./operations-pack.md)
- [Rollout plan](./rollout-plan.md)

## Negative authorization matrix

Phase 3 Workstream C, "Object-level authorization" (release blocker). Test-first
regression suite; no feature code was changed to make these pass. Enforcement
layers are documented in the module header of
[`tests/security/authzHarness.ts`](../../tests/security/authzHarness.ts):
Winter session → ORPC `protectedBase` (auth/CSRF/rate limits) → ORPC routers
(`app/rpc/routers/*`) → Control Plane gRPC clients (`app/services/control/*`)
→ interchat-control authorization (Iris, the enforcing layer). Object-level
checks live control-plane-side, so Winter-side tests assert clean denial
surfacing (no fallback write, no silent success, no data leakage) rather than
duplicating the check. The harness fakes only the gRPC boundary and drives the
real session, ORPC, router, and service code with fixture actors (owner,
authorized staff, insufficient staff, unrelated authenticated user, removed
staff). Reported findings are listed below; none is a privilege-escalation
hole.

| Case (minimum regression set) | Test file | Status |
| --- | --- | --- |
| Unrelated user changing `hub_id` cannot read private Hub rules, Team, announcements, Connections, audit, moderation records | `tests/security/objectAuthorization.test.ts` (private Hub reads; denial surfaces as generic unavailability, no data in message) | enforced — denial surfaced cleanly, control-plane side |
| Server manager cannot touch another `server_id` | `tests/security/objectAuthorization.test.ts` (Server scope) + `tests/security/actorBinding.test.ts` (sweep uses manager actor) | enforced — Discord manageable-guild gate denies before any Control Plane call; Control Plane denial also surfaces |
| Connection operations authorize the stored hub/server, ignoring untrusted companion IDs | `tests/security/objectAuthorization.test.ts` (Connection operations) | enforced — load-before-mutate on the stored record; foreign `connection_id` with attacker `hub_id` yields generic "not found"; no mutation call issued |
| Hub moderator cannot grant permissions they lack or remove the owner | `tests/security/objectAuthorization.test.ts` (Hub Team changes) | enforced — control-plane-side rank/owner checks; Winter surfaces denial without success |
| Inbox, preferences, and appeals bind to the authenticated actor | `tests/security/objectAuthorization.test.ts` (personal resources) + `tests/security/actorBinding.test.ts` (dashboard-preferences storage key) | enforced — actor derived from session; per-actor storage keys; cross-actor acknowledges denied |
| List endpoints cannot enumerate private IDs | `tests/security/objectAuthorization.test.ts` (enumeration) + `tests/security/actorBinding.test.ts` (actor binding across every route-level identifier) | enforced — lists are actor-bound end to end |
| Denial responses do not leak private-object existence | `tests/security/objectAuthorization.test.ts` (existence concealment) | enforced — identical NOT_FOUND denial for denied vs. missing Hub surfaces; bridge rows redact a denied or missing Hub's identity instead of surfacing it |

Additional coverage beyond the minimum set:

- Every route-level identifier (hub, server, connection, channel, rule, invite,
  announcement, staff assignment, role, infraction, appeal, review item,
  operation, inbox item, audit page, profile, activity, leaderboard, feedback)
  is swept in `tests/security/actorBinding.test.ts`: a browser-supplied
  `actorId`/`discordUserId` in the input is ignored and every Control Plane
  call carries the session actor.
- Unauthenticated requests are rejected before any handler, and a mutation
  without the signed-session CSRF token is rejected before dispatch
  (`tests/security/actorBinding.test.ts`).
- Winter server-side connection wrapper performs load-before-mutate
  authorization on the stored hub/server and passes the session actor, not any
  companion ID, to the Control Plane.

Findings — all three reported by the negative-authorization slice have since
been fixed (no feature behavior regression; suites updated to the intended
semantics):

- F-1 (fixed) — `app/routes/staff/relationships.tsx` rendered mock cytoscape
  data. The route now renders the actor's real Hubs and their Connections via
  the typed ORPC reads (`hub.getUserHubs`, `hub.getConnections`,
  `server.list`), resolves server names only where the actor manages the
  Server, and shows explicit loading, empty, and per-Hub "connections
  unavailable" states instead of fabricating data. No new Control Plane RPC
  was required.
- F-2 (fixed) — mappers read `Number(error.code)` on a string-coded
  `ControlPlaneError`, so denial codes never matched and denials collapsed to
  generic SERVICE_UNAVAILABLE/INTERNAL. All mappers now classify on the
  numeric gRPC status via a shared `grpcCodeOf` helper
  (`app/services/control/middleware.ts`). Because the Control Plane checks
  existence before permission, Hub-scoped surfaces (Hub, Hub features,
  moderation, selectors, previews, safety, operations) conceal
  PERMISSION_DENIED and NOT_FOUND behind one identical "not found or access
  denied" denial so responses cannot reveal private-object existence;
  Connection mutations keep honest FORBIDDEN semantics because their
  load-before-mutate step has already established visibility for the actor.
- F-3 (fixed) — the bridge-row Hub redaction in `serverService.bridges` was
  unreachable due to the F-2 helper defect, so the projection failed closed.
  With the helpers fixed, a denied or missing Hub lookup now redacts the
  row's Hub identity (including the raw ID) while the bridge stays visible;
  `tests/security/objectAuthorization.test.ts` asserts the redacted row.

Validation after the fixes: `bun test` — 152 passed, `bun run typecheck` and
`bun run check:control-types` passed. No phase-3 plan checkboxes were
modified.


## Evidence entry format

Each entry records the capability, repository SHA(s), command or environment,
date, operator/reviewer, result, and links to logs, traces, screenshots, or
test names. Local evidence is explicitly separated from staging evidence.

| ID | Phase/capability | Evidence | Environment | Owner | Date | Status |
| --- | --- | --- | --- | --- | --- | --- |
| P3-BASE | Phase 3 entry gate | All local gate requirements now pass: repo minimum-check list green (2026-09-04), old writers removed with structural guards (`P3-CUTOVER`), forbidden Winter credentials purged and enforced, outbox publisher/consumer monitored (`P3-OUTBOX-MON`), contracts additive and drift-checked (`P3-PROTO`), GitOps validated (`P3-GITOPS`) | local worktrees | release owner | 2026-09-04 | locally complete; staging trace + browser records outstanding |
| P3-TRANSPORT | Static Control Plane transport | Winter `133ab5e`, `0fed93f`, `a6da411`; `node scripts/generate-control-types.mjs`; generated drift check; `node scripts/validate-phase3.mjs` | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-WINTER-TEST | Winter regression suite | `BUN_TMPDIR=/tmp npx --yes bun@1.3.9 test` — 37 passed, 0 failed, 110 expectations; security subset after CSRF/shortcut changes — 10 passed, 0 failed, 29 expectations | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-WINTER-TYPE | Winter type and build gates | Winter `d372381`, `d1ddedb`, `fb649dd`; `node_modules/.bin/react-router typegen && node_modules/.bin/tsc --noEmit --pretty false`; `node_modules/.bin/react-router build` | Winter local worktree | implementation owner | 2026-09-01 | passed locally; build retains externalized-node and large-chunk warnings |
| P3-CONTROL | Durable operations, selectors, previews, and canonical Bot authorization | InterChat `2720242c`, `8cc84ba8`, `960e4076`, `9cf99ba9`, `cffc514d`, `9f7950e`, `239a558d`, `ccf8f953`, `f77516ce`, `dee5b6e6`, `fab45595`, `38717236`, `2c884935`, `57139110`, `44e8dbdf`, `846bd797`; selector suite — 7 passed; operation service suite — 5 passed; connection projection suite — 2 passed; resolver suite — 3 passed; typed Bot client suite — 2 passed; targeted Bot Ruff/Pyright passed. Bot Hub permission checks, outbox management reads, connection command mutations, Hub info/rules/disconnect lookups, deleted-channel cleanup, connection uniqueness reads, and connection target resolution now route through Control Plane. The additive `ResolveConnectionTarget` contract accepts one public name or valid invite, conceals private-name enumeration, does not consume the invite, and leaves mutation-time reauthorization/consumption to `ConnectChannel`; canonical connection reads expose the latest linked operation; bridge views display desired connection state separately from observed health | InterChat local worktree | implementation owner | 2026-09-01 | passed locally; repository-wide Bot Pyright crashes pre-existing; Bot locale submodule unavailable for affected pytest collection |
| P3-SELECTORS | Hub/Server named entity discovery | InterChat `2720242c`, `8cc84ba8`, `960e4076`; focused selector suite covers Hub users, Server members, Server roles, manageable Server targets, parent scoping, pagination, and re-resolution | InterChat local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-OPERATIONS | Durable partial outcomes and service-only progress | InterChat `9cf99ba9`, `cffc514d`, `9e3166bb`, `f77516ce`, `ccf8f953`, `9b5d452f`; operation progress accepts terminal `PARTIAL`, emits a durable transition, rejects human actors, returns typed `NOT_FOUND`, and connection connect/disconnect/toggle/repair mutations are correlated to durable operations with started/completed/failed outbox events; Control Plane operation suites — 11 passed; connection maintenance correlation tests — 4 passed; Bot typed client correlation test — 1 passed | InterChat local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-LIFECYCLE | Canonical impact review | Winter `c7d16dd`; typed preview BFF and Hub transfer/deletion review dialog revalidate resource version and exact confirmation | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-BFF-OPS | Durable operation visibility | Winter `d372381`; typed ORPC get/list/cancel/retry routes expose Control Plane operation state without local persistence or fallback | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-UX-SHORTCUTS | Keyboard navigation foundation | Winter `d1ddedb`, `fb649dd`; guarded `/`, `g h`, `g s`, and `?` shortcuts with accessible help dialog; raw Discord ID removed from the user bar | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-UX-STATES | Truthful bridge state and health | Winter `b12d0eb`, `4b30fb1`, `5946573`, `7959236`, `26e19e0`; server bridge resources preserve Control Plane observed health and operation metadata, UI separates enabled/paused desired state from health attention, bridge search no longer enumerates raw channel IDs, unavailable names/timestamps remain explicit instead of fabricated, disconnect uses an accessible typed confirmation, and Hub and Server bridge rows show observed health separately. Operation polling uses the canonical operation ID: pending/running, partial, failed, cancelled, completed, and unavailable are distinct states; only pending/running poll. A server bridge is paused only when canonical desired configuration says disconnected; health/status messages are never repurposed as pause state or reason. `react-router typegen`, `tsc`, `validate-phase3`, and `operationPresentation.test.ts` (3 passed) passed | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-BOT-MODERATION-UI | Bot moderation presentation boundary | InterChat `adeeac49`; Hub sanction, appeal, and infraction views use canonical Control Plane responses and no longer render raw subject/infraction identifiers; targeted Ruff/Pyright passed | InterChat local worktree | implementation owner | 2026-09-01 | passed locally; locales submodule initialized 2026-09-04, full Bot pytest suite passes (678) |
| P3-ANNOUNCEMENTS | Canonical announcement version integrity | InterChat `083c57e7`; update/delete/state-transition handlers reject missing or invalid caller versions and the scheduler refuses records without a canonical positive version; focused announcement suite — 5 passed; Ruff/Pyright passed | InterChat local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-PROTO | Additive protobuf contracts | protobuf `a9e9651`; `buf lint` (1.72.0) and `buf breaking --against main` (cloned main, `buf dep update` first) passed; `RecordRuleAcceptance` added additively to `HubService`; InterChat Python bindings + `.pyi`, descriptor set, and Winter static TypeScript bindings regenerated | protobuf local worktree | implementation owner | 2026-09-04 | passed locally |
| P3-GITOPS | Winter deployment boundary | GitOps `3d30a87`; all 12 overlays render via `kubectl kustomize` and pass `kubeconform -strict` (CRD schemas ignored — applied in-cluster) and `conftest` policy tests after Rego v1 migration of `policies/phase3.rego`; Winter Iris/Polarizer paths removed and key-ring refs present | GitOps local worktree | operations owner | 2026-09-04 | passed locally; no apply |
| P3-PREVIEW-IMPACT | Hub impact enumeration for DELETE/TRANSFER_OWNERSHIP/LOCKDOWN | InterChat worktree (uncommitted): `preview_servicer.py` populates per-category `affected_resources` aggregates (counts, never raw child IDs) and action warnings from the canonical list handlers under the caller's context, failures propagate instead of understating; LOCKDOWN joins the destructive set; `composition.py` wires the connection servicer; preview/selector suite — 10 passed; operation suites — 11 passed; Ruff and control-plane Pyright passed | InterChat local worktree | implementation owner | 2026-09-04 | passed locally |
| P3-CUTOVER | Old-writer removal / no fallback or silent SQL bypass | InterChat `bdd3a439`, Winter `d7c6301`: bot `fix_connections` no longer writes Connection rows through the ORM — disconnect/repair/unpause route through Control Plane with the `interchat-bot`/`system` service identity (disconnect handler gained the same `bot_automation` exemption as repair/toggle); rules acceptance moved behind the new `HubService.RecordRuleAcceptance` RPC (self-only actor binding, idempotent replay, audit entry) and the bot's direct SQL writer fails closed; dead `touch_last_active`/`update_hub_activity` writers deleted; Hub streak/activity metrics documented as bot-owned telemetry in the data-access inventory; Winter `.env` bot token + Iris/Polarizer credentials purged, `validate-phase3.mjs` and security tests now scan local env files; structural guard `test_control_plane_ownership.py` extended (connection maintenance, rules acceptance); replay suite covers service-identity disconnect. `ic lint`, `ic typecheck control bot`, `ic test control bot` — 678 passed, 0 failed (locales submodule initialized) | InterChat + Winter local worktrees | implementation owner | 2026-09-04 | passed locally; staging trace pending |
| P3-OUTBOX-MON | Outbox publisher/consumer monitoring | InterChat `bdd3a439`: consumer emits structured `control_outbox_lag` observations (stream length + group pending, 30 s interval, warn at 100 unacked); new publisher-restart test proves a crash between `xadd` and `mark_published` redelivers with the same event ID (absorbed by consumer done-marker); alert definitions (Warn >100 5m / Page >1000 10m + consumer-log P2) recorded in the operations pack | InterChat local worktree | implementation owner | 2026-09-04 | passed locally; SigNoz wiring pending staging |

## Release blockers

The release remains blocked while any required Phase 1/2/3 gate lacks evidence,
Winter has a forbidden credential or shared-table access, a fallback writer
exists, a critical/high security finding is open, or staging/public rollout
has not been separately authorized.

Known local verification blockers are resolved as of 2026-09-04: Bun (1.4.1),
Buf (1.72.0), kubeconform, and Conftest are installed and the gate commands
pass. Remaining blockers are deployment-side: browser/Playwright, Lighthouse,
k6, full cross-repository CI, independent security review, staging
authorization, and cohort rollout evidence. No migration has been applied,
manifest has been applied, image has been published, or release has been
deployed.
