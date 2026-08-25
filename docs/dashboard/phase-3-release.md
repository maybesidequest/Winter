# Phase 3: Make Winter the preferred management surface and release it

Phase 3 turns verified bot-management parity into a product that ordinary users can operate safely. It covers dashboard-native UX, security hardening, accessibility, performance, operations, rollout, and rollback. It ends with a recorded public-release decision.

Previous: [Phase 2 — Bot management parity](./phase-2-bot-parity.md)

## Read this before changing code

Phase 3 is not a UI-only phase. It cannot repair an incomplete control plane or hide missing parity behind polished pages.

Work in this order:

1. Prove the Phase 1 and Phase 2 exit gates with current evidence.
2. Remove shared-database access, bot credentials, fallback writers, fake data, and unresolved high-severity authorization bugs.
3. Test the six release journeys with non-technical users and repair the workflows they cannot complete.
4. Complete accessibility, performance, security, reliability, and operational work.
5. Rehearse rollout and rollback in a production-like environment.
6. Record a go or no-go decision against published thresholds.

Do not mark a checkbox because a route, class, test file, manifest, or UI control exists. Mark it only when the behavior works through the deployed path and the linked evidence proves the claim.

## How to use this document

Every checked item needs one of these:

- a passing automated test or CI run;
- a staging or production-like deployment result;
- a dashboard, trace, alert, or recorded failure exercise;
- a dated manual QA record with tester, environment, steps, and result;
- an approved exception with owner, risk, expiry date, and removal ticket.

Create `docs/dashboard/release-evidence.md` before implementation. Link every artifact there and link each checked item back to the relevant evidence entry. A screenshot proves presentation, not authorization, persistence, side effects, or recovery.

Use these meanings consistently:

- **Implemented:** the authoritative service, bot adapter, Winter adapter, UI, tests, telemetry, and cutover are complete.
- **Visible:** a production user can reach the control without a development-only flag.
- **Working:** the canonical value survives refresh and the expected side effects finish or expose durable progress.
- **Authorized:** the control service checks the current actor against the exact object and action at execution time.
- **Released:** the capability passed its cohort rollout and remains inside the published error, latency, and task-success thresholds.

## Non-negotiable decisions

### Product scope

Winter covers non-contextual management for normal users, Hub staff, and Server managers. It should make multi-step management easier than Discord commands.

Winter includes:

- Hub discovery, creation, configuration, connections, Team, moderation, logging, announcements, audit, ownership transfer, and deletion;
- Server setup, Calls configuration, prefix, blocklist, Hub connections, and connection maintenance;
- personal profile, preferences, inbox, activity, feedback, and appeals;
- connecting a selected Discord Server channel to a Hub.

Winter excludes:

- starting, joining, skipping, or ending Calls or Group Calls;
- in-Call friend requests;
- reporting a message;
- general message browsing or message-info tools;
- global InterChat staff, developer, beta-administration, MUD, and global trust-and-safety tools;
- Billing and subscriptions.

Hide excluded features completely in production navigation. In particular, do not show a disabled Billing tab or a `Coming Soon` Billing item.

This Billing decision supersedes the older Phase 1 instruction to keep Billing visible as `Coming Soon`.

### One implementation for bot and dashboard

`interchat-control` owns every shared management capability. The bot and Winter adapt their authenticated actors and presentation to the same resource-oriented operation.

```text
Winter browser → Winter ORPC BFF ─┐
                                  ├→ interchat-control → Iris
Discord interaction → bot ────────┘                    → PostgreSQL
                                                       → Discord REST
                                                       → outbox → EventBus
```

- Winter owns browser sessions, OAuth presentation, CSRF protection, page composition, form state, and UI copy.
- The bot owns Discord interactions and contextual Discord actions.
- The control service owns authorization, validation, transactions, versions, idempotency, audit, and management side effects.
- Iris owns Hub authorization. Discord owns current Server and channel authorization.
- Atlas in InterChat owns the shared management schema.

The control service must remain outside active Calls, matchmaking, broadcasts, and Prism delivery. A control-service outage may block management work; it must not stop live communication.

### Winter database boundary

By release, Winter has no credential that can read or write InterChat control-plane-owned management tables. This includes Hub, Server, Connection, moderation, authorization, audit, outbox, and bot-owned tables.

Winter may use Winter-owned storage for browser sessions, OAuth tokens, CSRF state, short-lived UI drafts, and other web-only concerns. Keep that storage in a separate schema or database role with no grants on InterChat management tables.

If Winter needs a local read model, the control service must publish it through a versioned contract or event. Winter owns that read model, its schema, and its migrations. It must not join to shared management tables or treat a Drizzle mapping of an Atlas-owned table as a read model.

Temporary shared-table reads allowed during Phases 1 and 2 are forbidden at the Phase 3 exit gate.

### Credential boundary

- Winter may hold a user OAuth credential required for the signed-in user's Discord experience.
- Winter must not hold the Discord bot token.
- The control service may hold the bot credential for management-side Discord REST calls.
- Every required production secret must fail startup when absent. Test fakes must require an explicit test environment or injected adapter; production code never treats a missing credential as authorization.
- Protobuf responses, logs, traces, errors, and browser payloads never expose webhook tokens, bot credentials, session secrets, or database URLs.

## Phase-entry gate

Do not call Phase 3 active until all items below pass. UX research and isolated component work may run in parallel, but no release checklist item can compensate for a failed entry gate.

- [ ] Phase 1 and Phase 2 exit gates have current evidence, not an implementation claim.
- [ ] The capability matrix accounts for every included normal-user, Hub-staff, and Server-manager command.
- [ ] Bot and Winter use the same authoritative handler for every migrated capability.
- [ ] Old bot and Winter writers have been removed; no fallback, dual-write, or silent SQL bypass remains.
- [ ] Every mutation preserves its idempotency key across transport retries and uses the current resource version.
- [ ] The outbox has a running publisher, deduplicating consumers, restart tests, and lag monitoring.
- [ ] Generated Python and TypeScript contracts are reproducible, checked for drift, and consumed without `any`, dynamic descriptors, or hand-copied message types.
- [ ] Control-plane workloads, certificates, policies, probes, resources, disruption budgets, and alerts exist in GitOps and render successfully.
- [ ] Winter has no Discord bot token and no shared-management-table credential.
- [ ] No production endpoint returns fabricated records, hard-coded live status, placeholder counters, synthetic webhook URLs, or false success.
- [ ] No unresolved critical or high security finding remains.

If any item fails, fix it in the phase that owns the defect and update that phase's evidence. Do not redefine the defect as Phase 3 polish.

## Implementation protocol

Use this protocol for each journey or capability. It prevents broad, shallow changes from looking complete.

1. Read the capability row, repository rules, protobuf contract, current bot behavior, and existing tests.
2. Trace the current browser, Winter, control-service, database, Iris, Discord, outbox, and bot paths. Treat comments and previous completion claims as unverified.
3. Fill out the Phase 2 implementation-ticket template. Resolve missing permissions, ownership, failure behavior, and side effects before coding.
4. Implement or repair the authoritative control-service handler first.
5. Generate and consume typed clients. Then adapt the bot and Winter to that handler.
6. Add negative authorization, conflict, retry, rollback, outbox, and side-effect tests before exposing the UI.
7. Remove superseded writers, fallbacks, credentials, schema mappings, and feature flags whose rollout has finished.
8. Deploy to staging and run the complete browser journey, including at least one denial and one dependency failure.
9. Link the evidence, review the diff across every affected repository, and only then mark the item complete.

If a required dependency, credential, contract, migration, consumer, or test environment is missing, stop and record the blocker. Do not substitute a fake success, permissive adapter, synthetic record, hard-coded status, skipped check, or direct SQL path.

### Prohibited completion shortcuts

The following patterns fail the gate even when the happy-path UI appears to work:

- a missing credential grants access, returns healthy, or creates a synthetic external resource;
- Winter catches a control-service failure and writes through Drizzle or SQL;
- the bot catches a control-service failure and invokes its old writer;
- an outbox row is inserted but no deployed worker publishes it or no consumer deduplicates it;
- an idempotency key is regenerated during a retry or a replay returns current state instead of the saved result;
- a client hard-codes `expectedVersion: 1` or silently overwrites a conflict;
- generated TypeScript types exist but the runtime client erases them to `any`, `unknown`, a dynamic descriptor, or hand-written duplicates;
- application handlers construct concrete infrastructure because unused port interfaces exist elsewhere;
- CI exits successfully after skipping Buf, code generation, tests, migrations, browser checks, or deployment rendering;
- a Kubernetes manifest, probe, alert, or policy is described in documentation but absent from the rendered deployment;
- a route returns zeroes, sample content, `Active`, `healthy`, fake webhook URLs, or other fabricated production state;
- a broad permission check substitutes for the exact field, action, child resource, Server, channel, or target-rank check;
- a page is declared complete because it renders, while empty, denial, conflict, outage, refresh, or recovery behavior is missing.

## Required release artifacts

Create and maintain these artifacts. Developers may choose their exact format, but each artifact must answer the stated questions.

| Artifact | Required content |
| --- | --- |
| Capability matrix | Bot surface, Winter route, control RPC, permission, flag, tests, cutover status, contextual exclusion |
| Data-access inventory | Every Winter credential and datastore; tables or keyspaces it can access; owner; purpose; expiry |
| Authorization matrix | Actor type × action × resource; public/private rules; parent scoping; expected deny behavior |
| Threat model | OAuth, sessions, CSRF, SSRF, mTLS, service identity, actor forwarding, Discord REST, webhook secrets, authorization caches, exports, and audit data |
| Journey map | Entry point, prerequisites, happy path, empty state, denial, conflict, partial failure, recovery, and next action for each release journey |
| Test matrix | Unit, permission, contract, integration, component, browser, accessibility, migration, load, outage, and rollback coverage |
| Operations pack | SLOs, dashboards, alerts, owners, runbooks, recovery objectives, dependency map, and escalation path |
| Rollout plan | Cohorts, flags, thresholds, observation window, stop conditions, rollback steps, and decision owners |
| Release evidence index | Links to every automated result, manual QA record, security review, game day, and approved exception |

## Definition of done for a page or workflow

A page is complete only when every visible capability on it satisfies all sections below.

### Authoritative behavior

- [ ] Reads and writes use typed control-service contracts or an explicitly approved Winter-owned read model.
- [ ] The control service authorizes the actor against the requested resource and exact action.
- [ ] The service validates parent-child relationships instead of trusting paired IDs from the browser.
- [ ] Mutations are version-aware, idempotent, audited, and transactionally enqueue required effects.
- [ ] External side effects expose truthful observed state and durable recovery when they outlive the request.
- [ ] The bot reaches the same operation and produces equivalent validation, authorization, audit, and side effects.
- [ ] Superseded direct SQL, bot-only, and Winter-only paths are deleted.

### Complete UI states

- [ ] Loading, empty, read-only, validation, permission-denied, conflict, dependency-unavailable, partial-failure, success, and durable-pending states are implemented.
- [ ] A failed or pending operation never appears as completed.
- [ ] A refresh shows the canonical resource and current observed state.
- [ ] Permission changes during an open page disable or reject stale actions safely.
- [ ] Development-only controls remain unreachable in production builds.

### Verification

- [ ] Permission tests cover owner, allowed staff, insufficient staff, unrelated authenticated user, removed staff, and dependency failure.
- [ ] Contract tests use the generated Python and TypeScript types against shared fixtures.
- [ ] Browser tests exercise the deployed browser → Winter → control-service path.
- [ ] Failure tests prove rollback, retry, idempotent replay, stale-version conflict, outbox restart, and compensation where applicable.
- [ ] Logs, traces, metrics, and audit records identify the capability and result without secrets.

## Workstream A: Dashboard-native workflows

Winter should win when a task needs context, comparison, review, or several steps. The bot remains better for quick actions beside the Discord conversation.

### Guided work

- [ ] Setup, Hub creation, channel connection, Team changes, logging, announcements, sanctions, ownership transfer, and deletion use focused workflows.
- [ ] Each workflow shows prerequisites before asking for input.
- [ ] Discord entities use names, icons, channel types, and permission state. Raw IDs appear only as optional technical details.
- [ ] Forms preserve valid work across recoverable failures and safe navigation.
- [ ] Completion screens name the result, unfinished side effects, warnings, and best next action.

### Effective configuration

- [ ] Each inherited or overridden value names its source: InterChat default, Hub, Server, or Connection.
- [ ] Desired configuration and observed state appear separately.
- [ ] Reset means “inherit again”; it never copies the current inherited value.
- [ ] Conflicts explain what changed and offer review before retry.
- [ ] Technical explanations remain optional for normal completion.

### Preview and impact

- [ ] Branding, welcome messages, rules, badges, logging destinations, and announcements have accurate previews.
- [ ] Team and permission changes show who gains or loses access.
- [ ] Lockdown, disconnect, bulk changes, ownership transfer, purge, and deletion enumerate affected resources.
- [ ] Destructive actions identify the exact target and require proportionate confirmation.
- [ ] Long-running work shows durable progress and remains discoverable after navigation.

### Efficient management

- [ ] Search, filters, sorting, pagination, and selected tab use URL state.
- [ ] Tables offer only useful bulk actions, with review and per-item results.
- [ ] Users can save named views for common filters.
- [ ] Recent and favorite Hubs and Servers are easy to reach.
- [ ] Keyboard shortcuts cover navigation and safe actions without overriding browser or assistive-technology conventions.
- [ ] Empty selections, partial bulk failures, and mid-operation permission changes have explicit behavior.

### History and recovery

- [ ] History shows actor, source, time, reason, resource, and readable before/after changes.
- [ ] Restoring a safe previous configuration creates a new authorized and audited mutation.
- [ ] Undo appears only when the service can prove it is safe.
- [ ] Stale browser tabs cannot overwrite newer work without review.
- [ ] Durable operations expose status, retries, failure reason, and recovery action.

## Workstream B: Navigation and content

- [ ] Page titles name the resource and task.
- [ ] Tabs use short literal labels; no unexplained `&`, slash-command names, or catch-all pages.
- [ ] One concept uses one name across Winter, the bot, contracts, help, and audit events.
- [ ] Descriptions explain what the user can do.
- [ ] Errors state what happened, whether anything changed, and what to do next.
- [ ] Success messages name the saved resource and distinguish completed from pending side effects.
- [ ] Dates, durations, visibility, sanctions, permissions, and destructive consequences use plain language.
- [ ] Hidden or excluded capabilities do not appear in navigation, search, help, empty states, or marketing copy.

Agreed management navigation:

- Hub: Overview, General, Connections, Modules, Moderation, Logging, Badges, Invites, Team, Announcements, Settings.
- Server: Overview, Hubs, Calls, Blocklist, Settings.

A tab remains hidden until every visible control meets the page definition of done.

## Workstream C: Security and privacy

### Object-level authorization

Build a negative authorization test matrix for every identifier accepted by a route or RPC: Hub, Server, Connection, channel, role, staff assignment, announcement, invite, rule, infraction, appeal, user profile, inbox item, audit event, message record, and durable operation.

- [ ] Every request derives the actor from a verified Discord interaction or server-side OAuth session; the browser cannot choose the actor.
- [ ] Every handler authorizes the actual loaded object, not an unverified parent ID supplied beside it.
- [ ] Child-resource queries and mutations include the parent ID in the repository predicate.
- [ ] Public, unlisted, private, staff-only, and self-only reads have explicit policies.
- [ ] List endpoints apply the same policy as single-resource endpoints and cannot enumerate private IDs.
- [ ] Response differences do not reveal private object existence where policy requires concealment.

Minimum regression cases:

- [ ] An unrelated user cannot read a private Hub, its rules, Team, announcements, Connections, audit, or moderation records by changing `hub_id`.
- [ ] A Server manager cannot read or mutate another Server by changing `server_id`.
- [ ] A Connection operation loads the Connection first and authorizes its stored Hub and Server; it ignores an untrusted companion Hub or Server ID.
- [ ] Discord channel validation proves `channel.guild_id == server_id`, actor access, bot access, supported type, send permission, and webhook permission.
- [ ] A user can view only public profile fields allowed by privacy and badge-visibility settings.
- [ ] Inbox, preferences, appeals, and personal data bind to the authenticated actor unless a documented staff policy applies.
- [ ] A Hub moderator cannot grant permissions they lack, create a protected role, modify an equal-or-higher-ranked actor, or remove the owner.
- [ ] Removing or reducing access invalidates Iris and Winter authorization caches before the mutation reports success.
- [ ] Logging destinations and notification roles belong to an authorized Server/channel context; arbitrary Discord IDs are rejected.
- [ ] Message or audit records never accept a browser-supplied origin Server/channel without resolving an authorized stored relationship.

### Service and secret security

- [ ] mTLS authenticates separate bot and Winter service identities and method allowlists restrict each identity.
- [ ] NetworkPolicies allow only required workloads and dependencies.
- [ ] Missing Iris, Discord, database, certificate, or EventBus configuration fails closed.
- [ ] Rate limits cover sign-in, reads, searches, exports, mutations, and Discord-dependent work.
- [ ] CSRF, session rotation, logout, OAuth refresh, open redirects, and SSRF-sensitive URL fields have tests.
- [ ] Secrets rotate successfully and never appear in browser payloads, logs, traces, audit records, fixtures, or generated artifacts.
- [ ] An independent review reports no unresolved critical or high finding.

## Workstream D: Truthful data and useful insights

- [ ] Overview cards answer a management question and link to the relevant resource.
- [ ] Charts state period, timezone, source, last update, and missing-data behavior.
- [ ] Analytics, desired configuration, observed health, and audit history remain separate resources.
- [ ] No production card uses mock, guessed, fabricated, or hard-coded live data.
- [ ] Counters have an authoritative source and a reconciliation strategy.
- [ ] Sensitive moderation and safety data is minimized and permissioned.
- [ ] Exports enforce the same authorization, filters, retention, and audit rules as the screen.

## Workstream E: Accessibility, devices, and performance

### Accessibility and devices

- [ ] Every workflow works by keyboard alone and shows visible focus.
- [ ] Screen readers receive names, descriptions, validation, progress, and result announcements.
- [ ] Color is never the only state or severity signal.
- [ ] Text, controls, focus, and targets meet WCAG 2.2 AA.
- [ ] Reduced motion is respected.
- [ ] At 320 px width, users can navigate, review, and save without hidden controls or page-level horizontal scrolling.
- [ ] At 200% and 400% zoom, dialogs, tables, menus, and forms remain usable.
- [ ] Supported browsers are named and covered by smoke tests.

### Performance

Set final budgets from production-like traces before launch and record the chosen test profile.

- [ ] Authenticated-route p75 LCP is at most 2.5 seconds on the agreed mobile profile.
- [ ] p75 INP is at most 200 ms and p75 CLS is at most 0.1.
- [ ] Control-service reads and ordinary mutations have explicit p95 latency SLOs.
- [ ] Large Hub and Server collections use server pagination and bounded queries.
- [ ] Secondary charts and panels do not block the primary task.
- [ ] Bundle, image, query-count, and payload budgets fail CI or create a release-blocking warning.
- [ ] A production-like high-volume dataset passes load and browser tests.

## Workstream F: Reliability and operations

- [ ] Winter and the control service publish SLOs, dashboards, alerts, owners, and escalation paths.
- [ ] Startup, readiness, liveness, graceful shutdown, resource limits, disruption budgets, and topology spread are tested.
- [ ] A control-service outage does not interrupt active Calls, matchmaking, broadcasts, or Prism delivery.
- [ ] Iris, Discord, PostgreSQL, Redis/EventBus, and downstream partial outages fail safely and produce useful UI states.
- [ ] Outbox lag, stuck operations, failed compensation, authorization failures, error rate, and latency alert the correct owner.
- [ ] Reconciliation detects stale counters, unhealthy webhooks, stuck operations, and orphaned external resources.
- [ ] Backup restoration meets recorded recovery-point and recovery-time objectives.
- [ ] Runbooks cover rollback, certificate expiry, bad migration, provider outage, stuck operation, audit investigation, backup restore, and secret rotation.
- [ ] A game day tests at least one dependency outage and one application rollback.

## Workstream G: Testing and delivery

- [ ] Unit, permission, contract, integration, component, browser, accessibility, migration, load, outage, and rollback suites pass in CI.
- [ ] CI fails when Buf, generators, generated outputs, schemas, or required test dependencies are missing. It never silently skips a required check.
- [ ] Protobuf compatibility covers the oldest supported bot, Winter, and control-service versions.
- [ ] Atlas migrations are reviewed, linted, tested forward, and tested against a restored production-like snapshot.
- [ ] Production builds are reproducible; images are scanned and signed according to project policy.
- [ ] Feature flags have an owner, purpose, rollout plan, safe default, and expiry.
- [ ] Staging uses production-like service identities, networking, contracts, and dependencies without production secrets.
- [ ] Test failures are fixed or documented as approved release exceptions; commands do not use `|| true`, blanket ignores, or reduced type safety to manufacture a pass.

Minimum repository checks:

```text
# Winter
bun run generate:control-types
bun run typecheck
bun run build

# InterChat
uv run ic lint
uv run ic typecheck control bot
uv run ic test control bot

# interchat-protobuf
./scripts/generate.sh
buf lint
buf breaking --against '.git#branch=main'

# interchat-kube-talos
kubectl kustomize kubernetes/apps/control-plane/overlays/staging
kubectl kustomize kubernetes/apps/control-plane/overlays/prod
kubectl kustomize kubernetes/apps/winter/overlays/staging
kubectl kustomize kubernetes/apps/winter/overlays/prod
```

CI must also fail when generation changes committed output. Add the required component, browser, accessibility, load, and outage commands to the relevant package scripts instead of relying on undocumented local commands.

## Release journeys

Test these journeys through the deployed application with real control-service behavior:

1. Connect a manageable Server channel to a public Hub and recover from missing bot permissions.
2. Add, edit, reorder, and remove a Hub rule, including a stale-version conflict.
3. Configure Calls without starting a Call and explain the effective values.
4. Block and unblock a user or Server with correct target, reason, audit, and duplicate handling.
5. Invite a Team member, grant only allowed permissions, then remove access and prove immediate denial.
6. Find an audit change, understand the diff, and restore a previous safe configuration through a new mutation.

At least five target users with low technical confidence attempt all six journeys without coaching.

- [ ] At least 80% complete each journey without developer help.
- [ ] No common journey requires a Discord snowflake, raw permission bit, webhook URL, or slash-command knowledge.
- [ ] Every serious error, hesitation, wrong turn, and misunderstood destructive consequence is fixed or recorded as an approved exception.
- [ ] Mobile, keyboard, screen-reader, high-zoom, empty, slow, denial, conflict, and dependency-error states receive manual QA.

## Launch and rollback

- [ ] Name the release owner, decision maker, incident lead, operations owner, and support owner.
- [ ] Start with maintainers, then internal users, then a small Hub cohort, then wider cohorts.
- [ ] Publish go/no-go thresholds for error rate, latency, authorization denial anomalies, stuck operations, task success, and support volume.
- [ ] Observe each cohort for the recorded minimum window before expanding it.
- [ ] Stop expansion automatically or procedurally when a threshold fails.
- [ ] Each capability flag can disable the new surface without dual-writing or corrupting state.
- [ ] Rollback is rehearsed and does not require reversing a destructive migration.
- [ ] Known issues and Discord-only boundaries are published before launch.
- [ ] Schedule the post-launch watch window and daily review cadence.

## Release blockers

Do not publicly release Winter while any condition below is true:

- Phase 1 or Phase 2 lacks current evidence.
- A visible control uses mock data, a placeholder, a fabricated success, or direct access to a shared management table.
- Bot and Winter can apply different authorization, validation, audit, or side effects for the same capability.
- Winter holds a Discord bot token or any credential for shared InterChat management tables.
- A normal journey asks for a snowflake, raw permission bit, or webhook URL.
- A destructive action lacks impact review, audit, idempotency, version handling, or recovery behavior.
- An unresolved critical or high security finding exists, including IDOR/BOLA or privilege escalation.
- A required migration, generated-contract check, backup restore, browser suite, accessibility suite, load test, outage test, or rollback rehearsal has not passed.
- The team cannot determine whether an operation succeeded, remains pending, failed safely, or needs intervention.
- A common task fails non-technical usability, keyboard, screen-reader, mobile, or high-zoom testing.
- Billing, global staff tools, Calls controls, message reports, or message-info tools appear as dashboard features.

## What developers may decide

Developers choose page composition, component boundaries, visual design, caching implementation, read-model technology, exact interaction details, and final SLO values after measurement. They may reorder independent workstreams while respecting the gates.

Developers may not weaken product scope, object-level authorization, the single-writer rule, data ownership, audit, idempotency, versioning, contextual exclusions, accessibility, or release blockers to meet a date. Record every exception with an owner, risk, expiry date, and removal ticket.

## Phase 3 exit gate

Phase 3 and the dashboard are complete only when:

- [ ] Every Phase 1, Phase 2, and Phase 3 gate has linked evidence or an approved time-bounded exception.
- [ ] Winter has no bot credential and no access to shared management tables.
- [ ] Normal users complete the six release journeys without command knowledge.
- [ ] Experienced managers work faster through search, bulk actions, previews, history, diffs, and safe recovery.
- [ ] All included bot-management capabilities share one authoritative implementation with Winter.
- [ ] An independent security review has no unresolved critical or high finding.
- [ ] The team can detect, explain, contain, and recover from failures.
- [ ] Rollout and rollback have passed in a production-like environment.
- [ ] The release owner records a go decision against the published thresholds.

At that point Winter is the preferred place for managing InterChat. The bot remains the preferred place for contextual Discord actions.
