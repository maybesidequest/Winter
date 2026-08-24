# Phase 1: Make the dashboard trustworthy

This phase builds the shared backend and removes anything that makes Winter look more complete than it is. When Phase 1 ends, Winter is still an internal product, but every visible control is real, authorized, audited, and safe to retry.

Next: [Phase 2 — Bot management parity](./phase-2-bot-parity.md)

## Start here

If you pick up Phase 1, do these in order:

1. Create the `control/v1` protobuf package and generated Python and TypeScript clients.
2. Scaffold the internal `interchat-control` Python service in the InterChat monorepo.
3. Deliver one complete vertical slice: edit a Hub's general details through the control service from both the bot and Winter.
4. Add audit, idempotency, authorization, contract, and failure-path tests to that slice.
5. Use the proven pattern to move the remaining management capabilities in Phase 2.

Do not start by filling every empty tab with forms. A form that writes around the bot's rules creates false parity and data drift.

## What we decided

### One management backend

Create a dedicated internal service called `interchat-control`. It is the only place allowed to perform InterChat management changes.

```text
Winter UI → Winter ORPC BFF ─┐
                             ├→ interchat-control → Iris
Discord command → bot ───────┘                    → PostgreSQL
                                                  → Discord REST
                                                  → outbox → EventBus
```

- Winter owns browser sessions, page composition, friendly validation, and UI state.
- The bot owns Discord interactions and contextual Discord features.
- `interchat-control` owns authorization, business validation, transactions, auditing, idempotency, and side effects for shared management capabilities.
- Iris remains the authority for Hub permissions.
- Discord remains the authority for native Server and channel permissions.
- Atlas in InterChat remains the only database migration authority.
- The EventBus handles reliable work after a command. It is not the synchronous API used by the UI.

Use Python for the new service. The mature behavior and SQLAlchemy models already live in InterChat, so Python lets us extract them instead of rewriting them. The protobuf contract keeps the boundary language-neutral for Winter and future clients.

### Why not the other options?

| Option | Benefit | Cost | Decision |
| --- | --- | --- | --- |
| API inside the bot | Fastest and no new workload | Dashboard uptime and load become tied to the Discord gateway; bot deploys and API deploys stay coupled | Do not choose as the target architecture |
| EventBus commands only | Durable and good for fan-out | Poor fit for immediate form validation, conflicts, and useful error messages | Use behind the service for side effects |
| Separate Go service | Strong isolation and good generated clients | Rewrites mature Python behavior and adds a third implementation language | Revisit only if Python becomes a measured limit |
| Separate Python service | Reuses existing behavior while isolating the control plane | Adds a deployment and network hop | Chosen |

This is a control-plane dependency only. A control-service outage must not stop active Calls, matchmaking, broadcasts, or Prism delivery.

### How we keep this affordable

- Keep the service in the InterChat monorepo and use Python. Do not create a new repository or rewrite proven behavior in another language.
- Begin with synchronous request handlers. Queue only Discord-dependent, bulk, or slow operations that genuinely need durable progress.
- Prove the design with Hub general settings before building shared platform features for every possible capability.
- Reuse Atlas, Iris, PostgreSQL, the existing EventBus, certificates, and observability.
- Migrate one capability behind a flag, switch the bot and Winter together, then delete the superseded write path.
- Add sagas and compensation only where external side effects require them, starting with channel connections.
- Keep one local-development command that starts the service and its required dependencies.
- Review delivery time, failure rate, and operational load after the first three slices. Simplify the design when a mechanism has no measured or near-term need.

Do not build a general workflow engine, a new authorization system, a second database schema, or a Kafka-only command API in Phase 1.

### Concrete implementation blueprint

The target is a permanent Python 3.14 service in the InterChat monorepo. It uses `grpc.aio`; do not use ConnectRPC Python while its runtime is pre-1.0. There is no planned Go rewrite.

Create this structure:

```text
InterChat/
├─ apps/
│  └─ control_plane/
│     ├─ pyproject.toml
│     ├─ src/control_plane/
│     │  ├─ main.py
│     │  ├─ config.py
│     │  ├─ transport/grpc/
│     │  ├─ application/hubs/
│     │  ├─ application/operations/
│     │  ├─ domain/
│     │  └─ infrastructure/
│     │     ├─ db/
│     │     ├─ iris/
│     │     ├─ discord/
│     │     └─ event_bus/
│     └─ tests/
│        ├─ unit/
│        ├─ contract/
│        └─ integration/
└─ packages/
   ├─ db_schema/
   └─ control_proto/
```

Boundary rules:

- `transport/grpc` authenticates the caller, converts protobuf messages, and maps typed failures. It contains no business rules.
- `application` implements complete use cases and controls the transaction boundary.
- `domain` contains transport-neutral commands, results, policies, and errors. It imports neither Discord.py UI types nor generated protobuf classes.
- `infrastructure` implements ports for PostgreSQL, Iris, Discord REST, and the EventBus.
- `apps/bot` and Winter are clients. They must not import the control service's application code.
- The new application uses strict Pyright settings even while the repository-wide default remains less strict.

#### Contract source and generated code

- The only hand-edited contract lives at `interchat-protobuf/control/v1`.
- InterChat generates Python messages and clients into `packages/control_proto`.
- Winter generates TypeScript messages and its server-side client into `app/generated/control/v1`.
- Pin generator versions. CI runs generation and fails if committed output differs.
- Each consumer pins a compatible protobuf module or commit; it never copies and edits a `.proto` file.

The first contract contains only:

```text
HubService.GetHub(GetHubRequest) -> Hub
HubService.PatchHub(PatchHubRequest) -> Hub
```

`Hub` contains `metadata`, editable `spec`, observed `status`, and `version`. `PatchHubRequest` contains request context, Hub ID, partial Hub spec, update mask, and expected version. The first update mask supports only name, tagline, description, welcome message, icon, banner, and visibility.

Use unary RPCs for these operations. Do not introduce streaming, an operation queue, or polling for the first slice.

#### Authentication and authorization

The browser never calls the control service directly.

- Kubernetes mTLS identifies the calling workload as Winter or the bot.
- The bot sets the actor from the verified Discord interaction.
- Winter sets the actor from its verified server-side Discord OAuth session.
- Request context includes actor ID, source, request ID, trace ID, and idempotency key.
- The service trusts the authenticated adapter to identify the actor, but never trusts permission bits or roles supplied by a client.
- The service asks Iris for the required Hub action at execution time and fails closed when authorization cannot be established.
- Server-scoped mutations independently verify current Discord permissions.
- Audit records include both the service principal and human actor.

The first slice accepts calls only from the bot and Winter service identities. Add other callers through an explicit certificate and method-allowlist change.

#### Persistence records

Add schema changes through `packages/db_schema` and Atlas:

- Add a monotonically increasing `version` column to `Hub`. A patch updates only when `id` and `version` match, then increments the version in the same statement.
- Extend the existing immutable `AuditLog` with request ID, trace ID, source, and calling service. Keep before/after JSON and retain the row after Hub deletion.
- Add `ControlIdempotency`: calling service, actor ID, RPC method, idempotency key, request hash, terminal code, serialized response reference or payload, creation time, and expiry. Uniqueness is scoped to calling service plus idempotency key.
- Add `ControlOutboxEvent`: event ID, aggregate type/ID/version, event type, payload, creation time, publish time, attempt count, and last error.

A normal mutation performs the versioned resource update, audit insert, idempotency result, and outbox insert in one database transaction. A repeated key with the same request hash returns the saved result. Reusing the key with different input returns a conflict.

Do not add a generic operation table in the first slice. Add one when the first genuinely long-running capability—normally channel connection—needs durable progress.

#### Synchronous versus durable work

Run inline when completion fits one short RPC and does not require a multi-step external change:

- ordinary configuration patches;
- rules and module changes;
- preferences and blocklist database changes;
- reads and audit queries.

Use a durable operation when work can outlive the request or needs compensation:

- creating or repairing Discord webhooks;
- connecting a channel to a Hub;
- bulk changes;
- large purges or exports;
- scheduled delivery changes that require reconciliation.

Durable operations expose `PENDING`, `RUNNING`, `WAITING_FOR_DISCORD`, `SUCCEEDED`, `FAILED`, and `NEEDS_ATTENTION`. UI copy translates these states into plain language.

#### Discord REST and rate limits

- Keep Discord-specific types inside `infrastructure/discord`.
- Expose application ports such as `DiscordGuildReader`, `DiscordPermissionChecker`, and `WebhookProvisioner`.
- Never pass Discord.py objects, webhook credentials, or bot cache objects into the application layer.
- Use one shared Redis-backed limiter for management calls made with the bot credential across replicas.
- Honor Discord retry headers, add deadlines, and bound retries. Do not retry permanent permission or validation failures.
- Encrypt stored webhook credentials and never return them through protobuf.
- Reconcile orphaned or half-configured webhooks after failures.

The first Hub General slice does not call Discord, so this infrastructure is not a prerequisite for its cutover.

#### Capability cutover

Use one flag per capability, evaluated independently by the bot and Winter but controlled from the same environment configuration. For the first slice use `CONTROL_HUB_GENERAL`.

1. Deploy the service and read APIs without changing writes.
2. Compare new and old read results in tests and staging logs without exposing sensitive values.
3. Enable the new Hub General write path for internal users in both clients.
4. Enable it for all users after the soak checks pass.
5. Remove the old Winter and bot mutation code.
6. Remove direct write permission for that capability where database grants allow it.

Never send the same mutation to old and new writers. Rollback means routing the capability back to the old path before any incompatible schema change, not dual-writing.

#### Required developer commands

Add and document these interfaces:

```text
uv run ic control start       # run the service locally
uv run ic test control        # unit, contract, and integration tests
uv run ic typecheck control   # strict control-service typecheck
buf lint
buf breaking --against '.git#branch=main'
```

Local startup must use one command or compose profile for PostgreSQL, Redis, Iris stub, and the control service. Discord and Iris adapters need deterministic fakes so the normal test suite does not require live services or credentials.

#### First-slice test specification

Before `CONTROL_HUB_GENERAL` can be enabled, tests must prove:

- both generated clients decode the same Hub fixture;
- Owner and authorized Manager can edit allowed fields;
- unauthorized actor and unavailable Iris fail without a database change;
- invalid name, URL, visibility, and empty required description return field-level errors;
- stale expected version returns the current version and does not overwrite it;
- repeated identical idempotency key returns the original result and creates one audit event;
- repeated key with different input returns a conflict;
- successful patch increments Hub version and commits audit, idempotency, and outbox records atomically;
- forced audit or outbox failure rolls the Hub update back;
- bot and Winter adapters produce the same request and map every typed result;
- rolling from the previous protobuf version remains compatible;
- the browser flow signs in, selects a Hub, edits one field, saves, refreshes, and sees the canonical value.

## Words used in these plans

- **Capability:** one useful outcome, such as changing Hub rules or blocking a user from a Server. A capability can have a Discord UI and a dashboard UI, but only one backend implementation.
- **Contextual action:** an action whose subject is the current Discord conversation, such as reporting a message or viewing message info. These remain in the bot for now.
- **Parity:** the bot and Winter offer the same non-contextual management outcomes. It does not mean copying slash commands into web forms.
- **Resource:** an object with identity (`metadata`), desired configuration (`spec`), and observed state (`status`).
- **BFF:** Winter's server-side ORPC layer. It adapts the browser session to the control API; it does not own InterChat business rules.
- **Done:** implemented, tested, authorized, audited, observable, documented, and no longer duplicated in another write path.

## Scope

Phase 1 includes:

- Typed contracts and generated clients.
- The dedicated control service and its Kubernetes deployment.
- One end-to-end management slice used by both surfaces.
- Correct authorization and field-level permission mapping.
- Audit events, idempotency, optimistic concurrency, and a transactional outbox.
- Truthful navigation, real dashboard data, secure configuration, tests, and operational basics.

Phase 1 does not include:

- Public release.
- Global InterChat staff tools.
- Billing or subscriptions.
- Starting or controlling a Call from Winter.
- Reporting a message or viewing message info in Winter.
- Completing every management feature; that is Phase 2.

## Work checklist

### 1. Publish the capability contract

Repository: `interchat-protobuf`

- [ ] Add `control/v1` contracts grouped by resource, not one large settings request.
- [ ] Start with `HubService.GetHub` and `HubService.PatchHub` for the first vertical slice.
- [ ] Define shared request context: request ID, actor ID, source, trace ID, and idempotency key.
- [ ] Add an expected resource version to mutations that can conflict.
- [ ] Return stable machine-readable error codes. UI copy does not belong in the service.
- [ ] Generate and publish Python and TypeScript clients.
- [ ] Run Buf lint and breaking-change checks in CI for every consumer.

Contract rules:

- Relationships such as a Connection or Team assignment are resources with their own IDs and state.
- Patch operations use an update mask. Do not treat a whole settings page as one permission.
- Never return webhook tokens, bot tokens, session secrets, or raw database models.
- Never accept cached permission flags from Winter as proof of authorization.

### 2. Build `interchat-control`

Repository: `InterChat`

- [ ] Add a separately runnable Python application under `apps/control_plane`.
- [ ] Add gRPC health endpoints, structured logs, traces, metrics, and graceful shutdown.
- [ ] Authenticate the bot and Winter with separate mTLS service identities.
- [ ] Reauthorize every Hub mutation through Iris.
- [ ] Recheck Server and channel permissions against Discord for Server-scoped mutations.
- [ ] Use the shared SQLAlchemy models and unit-of-work conventions.
- [ ] Add persistent idempotency results. Process memory is not enough during rolling deploys.
- [ ] Store a resource version and reject stale writes with a clear conflict result.
- [ ] Write the resource change, audit record, idempotency result, and outbox entries in one transaction.
- [ ] Add an outbox worker. Event consumers must deduplicate by event ID.

The service may call Discord REST for management operations. It must use rate limits, deadlines, and retry rules. It must not become part of the message broadcast or live Call data path.

### 3. Prove one complete vertical slice

Capability: edit Hub general details.

- [ ] Move name, description, tagline, welcome message, icon, banner, and visibility validation into the control service.
- [ ] Map each changed field to the correct Iris action.
- [ ] Make the bot's `/hub manage` general screen call the generated client.
- [ ] Make Winter's ORPC procedure call the generated client.
- [ ] Remove Winter's direct database write for this capability.
- [ ] Return the updated Hub resource and version to both clients.
- [ ] Record actor, source, before/after values, request ID, and trace ID in one audit event.
- [ ] Test bot and Winter adapters against the same contract fixture and expected result.

The cutover is atomic: old path or new path, never dual-write.

### 4. Make Winter a thin, safe BFF

Repository: `Winter`

- [ ] Keep Discord OAuth and browser session handling in Winter.
- [ ] Replace business-rule-heavy ORPC mutations with typed control-service calls.
- [ ] Convert typed service failures into plain, actionable messages near the relevant field.
- [ ] Include an idempotency key with every mutation and preserve it across retries.
- [ ] Show a conflict screen when another person changed the resource; never silently overwrite.
- [ ] Keep URL state for tabs, filters, sorting, search, and pagination.
- [ ] Do not copy Iris permission rules into React components.

Winter may keep temporary read mappings during migration. It must not create a second migration authority: no Drizzle push against shared production tables, and no hand-authored migration that competes with Atlas.

### 5. Tell the truth in the UI

Repository: `Winter`

- [ ] Show only working Hub and Server tabs to normal users.
- [ ] Allow development builds or explicit staff feature flags to expose work in progress.
- [ ] Keep Billing visible but disabled with `Coming Soon`; it is not part of parity.
- [ ] Remove mock activity, counters, and status labels from authenticated production pages.
- [ ] Replace hard-coded `Active`, healthy, or real-time claims with observed status or neutral copy.
- [ ] Give empty states a next action and permission-denied states a plain explanation.
- [ ] Ensure a read-only user never sees an enabled control they cannot use.

The agreed navigation names are short and literal:

- Hub: Overview, General, Connections, Modules, Moderation, Logging, Badges, Invites, Team, Announcements, Settings.
- Server: Overview, Hubs, Calls, Blocklist, Settings.

Tabs stay hidden until their capability is complete. Do not add `&` labels or combine unrelated jobs to save sidebar space.

### 6. Fix the security and permission baseline

Repositories: `Winter`, `InterChat`, `interchat-kube-talos`, `iris`

- [ ] Remove fallback secrets. Production startup fails clearly when a required secret is missing.
- [ ] Give Winter and the bot distinct client certificates and method allowlists.
- [ ] Add a NetworkPolicy so only the bot and Winter can call `interchat-control`.
- [ ] Move the bot token and management-table database access out of Winter as capabilities migrate.
- [ ] Stop storing staff authorization as a long-lived session truth; refresh it from Iris.
- [ ] Build a field-to-action permission table and test it. Lockdown, rules, logs, moderators, bans, and message moderation are different actions.
- [ ] Redact credentials and sensitive request fields from logs and traces.
- [ ] Add CSRF, secure-cookie, OAuth-state, rate-limit, and mutation-size checks.

### 7. Deploy and observe it

Repository: `interchat-kube-talos`

- [ ] Deploy at least two control-service replicas behind an internal ClusterIP Service.
- [ ] Add startup, readiness, and liveness probes.
- [ ] Add resource requests/limits, a disruption budget, topology spread, and graceful termination.
- [ ] Issue separate server and client certificates and rotate them through the existing secret system.
- [ ] Alert on RPC error rate, latency, Iris/Discord failures, outbox lag, and stuck operations.
- [ ] Add Winter probes and resource requests/limits; do not treat a running process as proof the app is ready.
- [ ] Document rollback and contract compatibility during rolling deployments.

### 8. Add a real test floor

- [ ] Unit-test validation, permission mapping, resource versioning, and error mapping.
- [ ] Contract-test generated Python and TypeScript clients against the same fixtures.
- [ ] Integration-test one successful change and every meaningful failure: forbidden, stale version, bad input, unavailable Iris, unavailable Discord, and repeated request.
- [ ] Test that one mutation creates exactly one audit record and durable outbox entries.
- [ ] Add Winter component tests for loading, empty, read-only, error, conflict, and success states.
- [ ] Add a browser smoke test for sign-in → select Hub → edit general details → see saved result.
- [ ] Run typecheck, lint, unit tests, contract tests, and the production build in CI.

## Developer freedom

Developers may choose internal class names, file splits, form libraries, query-cache details, and visual composition that follows Winter's design system. They may not change these boundaries without a recorded architecture decision:

- one authoritative management service;
- protobuf contracts with generated Python and TypeScript clients;
- Iris/Discord reauthorization inside the service;
- Atlas as the migration authority;
- transactional audit, idempotency, and outbox records;
- no direct Winter management writes after a capability is migrated.

## Phase 1 exit gate

Phase 1 is complete only when all statements are true:

- [ ] Hub general details use the same control-service implementation from the bot and Winter.
- [ ] Winter cannot bypass authorization or write that capability directly to PostgreSQL.
- [ ] Repeating a request is safe, concurrent edits are detected, and every change is audited.
- [ ] The service survives a replica restart without losing committed side effects.
- [ ] Production users see no mock data or unfinished feature tabs.
- [ ] Billing is disabled and marked `Coming Soon`.
- [ ] CI and the browser smoke test pass.
- [ ] The control service and Winter have probes, resources, mTLS, restricted network access, and useful alerts.

Passing this gate means the foundation is safe enough to scale out. It does not mean the dashboard is ready for public release.
