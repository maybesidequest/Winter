# Phase 3: Make it better and release it

Phase 3 turns complete management coverage into a dashboard that is genuinely easier than the bot for setup, review, and complex work. It ends with the public release decision.

Previous: [Phase 2 — Bot management parity](./phase-2-bot-parity.md)

## Start here

1. Run five non-technical users through the top journeys without coaching.
2. Fix the places where they hesitate, guess, copy IDs, or leave Winter for information it should already show.
3. Build the dashboard-native workflows below using real data.
4. Complete the release checklist and record evidence beside every checked item.

Do not release because every route renders. Release when ordinary users can finish important work safely and the team can operate the product under failure.

## What “better than the bot” means

The bot remains good for quick and contextual actions. Winter should win when the user needs context, comparison, review, or multiple steps.

### 1. Guided work instead of command arguments

- [ ] Setup, Hub creation, channel connection, Team changes, logging, announcements, sanctions, ownership transfer, and deletion use focused step-by-step flows.
- [ ] Every flow shows prerequisites before asking for input.
- [ ] Discord entities use names, avatars, channel types, and permission state; raw IDs are an optional advanced detail.
- [ ] Forms can be left and resumed without losing valid work where safe.
- [ ] Completion screens show the result, remaining warnings, and the best next action.

### 2. Effective configuration people can understand

- [ ] Every inherited or overridden value shows its source: InterChat default, Hub, Server, or Connection.
- [ ] A user can compare desired configuration with observed state.
- [ ] Reset means “inherit again,” not “copy the current inherited value.”
- [ ] Conflicts and blocked changes explain what must change first.
- [ ] Technical detail is hidden under an optional explanation, never required to complete a normal task.

### 3. Preview and impact before save

- [ ] Branding, welcome messages, rules, badges, and announcements have accurate previews.
- [ ] Permission and Team changes show who gains or loses access.
- [ ] Lockdown, disconnect, bulk changes, ownership transfer, purge, and deletion show affected resources.
- [ ] Destructive actions name the exact target and require an appropriate confirmation.
- [ ] Large operations show progress and allow the user to return later.

### 4. Faster work for experienced managers

- [ ] Search, filters, sorting, pagination, and selected tab are represented in the URL.
- [ ] Tables support useful bulk actions with a review step and per-item results.
- [ ] Users can save named views for common filters.
- [ ] Recent and favorite Hubs or Servers are easy to reach.
- [ ] Safe keyboard shortcuts exist for navigation and non-destructive actions.
- [ ] Empty selections, partial failures, and permission changes during a bulk action are handled explicitly.

### 5. History, diffs, and safe recovery

- [ ] Configuration history shows actor, source, time, reason, and a readable before/after diff.
- [ ] A user can restore a previous safe configuration by creating a new audited change.
- [ ] Undo is offered only when the service can prove it is safe; it is not a client-side illusion.
- [ ] Stale browser tabs cannot overwrite newer work without review.
- [ ] Long-running operations have durable status and a clear recovery path.

### 6. Useful, honest insights

- [ ] Overview cards answer a management question and lead to the relevant resource.
- [ ] Charts state their period, timezone, source, update time, and missing-data behavior.
- [ ] Analytics, configuration, and operational health remain separate resources.
- [ ] No card uses mock, guessed, or hard-coded “live” data.
- [ ] Sensitive moderation and safety data is minimized and permissioned.
- [ ] Export respects the same authorization, filters, retention, and audit rules as the screen.

## Navigation and content quality

- [ ] Page titles describe the current resource and task.
- [ ] Tabs use the agreed short labels; no unexplained `&`, slash-command names, or catch-all pages.
- [ ] The same concept has one name across Winter, the bot, contracts, help, and audit events.
- [ ] Descriptions say what the user can do, not what the component is called.
- [ ] Errors say what happened, whether anything changed, and what the user can do next.
- [ ] Success messages name the saved resource and do not claim unfinished side effects succeeded.
- [ ] Dates, durations, visibility, sanctions, permissions, and destructive consequences use plain language.
- [ ] Billing remains disabled with `Coming Soon` and stays outside the release promise.

## Accessibility and device support

- [ ] All workflows are usable by keyboard alone with visible focus.
- [ ] Screen readers receive names, descriptions, validation, progress, and success/error announcements.
- [ ] Color is not the only way state or severity is communicated.
- [ ] Text and controls meet WCAG 2.2 AA contrast and target-size expectations.
- [ ] Reduced motion is respected.
- [ ] At 320 px width, users can navigate, review, and save without hidden controls or horizontal page scrolling.
- [ ] At high zoom, dialogs and tables remain usable.
- [ ] Supported browsers are named and covered by smoke tests.

## Performance targets

Set the exact budgets from production traces before launch; do not silently weaken them later.

- [ ] Authenticated route p75 LCP is at most 2.5 seconds on the agreed mobile profile.
- [ ] p75 INP is at most 200 ms and p75 CLS is at most 0.1.
- [ ] Control-service read and ordinary mutation latency have explicit p95 SLOs.
- [ ] Large Hub and Server lists use server pagination and bounded queries.
- [ ] Expensive charts and secondary panels load without blocking the primary task.
- [ ] Bundle, image, query-count, and payload budgets fail CI or produce a visible release warning.
- [ ] A realistic high-volume Hub and Server dataset passes load and browser tests.

## Complete release checklist

Each checked item needs a link to a test run, dashboard, decision, or manual QA record. “Seems fine” is not release evidence.

### Product and parity

- [ ] Phase 1 and Phase 2 exit gates are complete.
- [ ] The capability matrix has no unexplained gap for normal users, Hub staff, or Server managers.
- [ ] Explicit Discord-only actions hand off cleanly and explain why they stay in Discord.
- [ ] Billing is not advertised as available.
- [ ] Global staff tools are not exposed or implied.
- [ ] Help, empty states, onboarding, and recovery instructions match the shipped product.

### Usability

- [ ] At least five target users with low technical confidence complete: connect a channel, change Hub rules, configure Calls, block a user, invite a Team member, and find an audit change.
- [ ] At least 80% complete each journey without developer help; all serious confusion is fixed or explicitly accepted.
- [ ] No common journey requires a Discord snowflake, raw permission bit, webhook URL, or command knowledge.
- [ ] Destructive-action comprehension is tested, not assumed.
- [ ] Mobile, keyboard, screen-reader, high-zoom, empty, slow, and error states receive manual QA.

### Correctness and data safety

- [ ] Bot and Winter run the same management capability implementation.
- [ ] Every mutation is authorized at execution time, validated, idempotent, version-aware, and audited.
- [ ] Transactional outbox, retries, deduplication, and compensation are tested under failure.
- [ ] No client dual-writes and no second migration authority remain.
- [ ] Reconciliation detects stale counters, unhealthy webhooks, stuck operations, and orphaned external resources.
- [ ] Backup restore is tested and meets recorded recovery point and recovery time targets.
- [ ] Data retention and deletion behavior is documented for accounts, audit history, messages, analytics, and secrets.

### Security and privacy

- [ ] A threat model covers OAuth, sessions, mTLS, service identities, actor spoofing, CSRF, SSRF, Discord REST, webhook secrets, authorization cache, exports, and audit data.
- [ ] An independent security review has no unresolved critical or high findings.
- [ ] Secrets have no fallback values, are scoped per workload, rotate successfully, and never appear in logs or API responses.
- [ ] NetworkPolicies and RPC method allowlists are verified in the deployed environment.
- [ ] Winter has no Discord bot token and no management-table write credential.
- [ ] Rate limits and abuse controls cover sign-in, reads, searches, exports, and mutations.
- [ ] Privacy policy, terms, support route, and security contact match the actual data flows.

### Reliability and operations

- [ ] Control-service and Winter SLOs, alerts, dashboards, and owners are recorded.
- [ ] Startup, readiness, liveness, graceful shutdown, disruption budgets, topology spread, and resources are tested.
- [ ] A control-service outage does not interrupt active Calls, matchmaking, broadcasts, or Prism delivery.
- [ ] Iris, Discord, PostgreSQL, Redis/EventBus, and downstream partial outages produce safe and understandable behavior.
- [ ] Outbox lag, stuck operations, webhook compensation, authorization failure, error rate, and latency alerts page the right owner.
- [ ] Runbooks cover rollback, certificate expiry, bad migration, provider outage, stuck operation, audit investigation, and secret rotation.
- [ ] At least one game-day exercise has tested a dependency outage and rollback.

### Testing and delivery

- [ ] Unit, permission, contract, integration, component, browser, accessibility, migration, load, and failover suites pass in CI.
- [ ] Protobuf compatibility is checked across the oldest supported bot, Winter, and control-service versions.
- [ ] Atlas migrations are reviewed, linted, tested forward, and tested against a restored production-like snapshot.
- [ ] Production builds are reproducible and images are scanned and signed according to project policy.
- [ ] Feature flags have owners, purpose, rollout plan, expiry, and a safe default.
- [ ] Staging uses production-like service identities, networking, contracts, and dependencies without production secrets.

### Launch and rollback

- [ ] Release owner, incident lead, support owner, and decision maker are named.
- [ ] Rollout starts with internal users, then a small Hub cohort, then wider cohorts based on error and task-success data.
- [ ] Go/no-go thresholds cover error rate, latency, authorization failures, stuck operations, user task success, and support volume.
- [ ] Every migrated capability can be disabled without dual-writing or corrupting state.
- [ ] Rollback has been rehearsed and does not require reversing a destructive migration.
- [ ] Known issues and Discord-only boundaries are published before launch.
- [ ] A post-launch watch window and daily review cadence are scheduled.

## Release blockers

Do not publicly release Winter while any of these are true:

- A visible control uses mock data, a placeholder, or a direct database write that bypasses the control service.
- The bot and Winter can produce different authorization or side effects for the same management action.
- A normal connection flow asks for a webhook URL or Discord ID.
- A destructive action lacks impact review, audit, idempotency, or recovery behavior.
- Winter still holds the Discord bot token or management-table write access.
- High-severity security findings, failing migrations, untested backup restore, or missing rollback remain.
- The team cannot tell whether an operation succeeded, is pending, or needs intervention.
- Basic tasks fail accessibility or non-technical usability testing.

## What developers may decide

Developers should choose the page composition, component boundaries, visualizations, caching strategy, and exact interaction details after testing them with users. They may also tune SLOs and performance budgets from real measurements before launch.

They should not weaken the product boundary, authorization model, single-writer rule, audit/idempotency requirements, contextual exclusions, accessibility baseline, or release blockers just to meet a date. Record any necessary exception with its owner, risk, expiry, and removal plan.

## Phase 3 exit gate

Phase 3 and the dashboard are complete when:

- [ ] Every release checklist item has evidence or an explicitly approved, time-bounded exception.
- [ ] Non-technical users can complete the key journeys without command knowledge.
- [ ] Experienced managers are faster because of search, bulk actions, saved views, previews, diffs, and safe recovery.
- [ ] The team can detect, explain, contain, and recover from failures.
- [ ] The release owner records a go decision against the published thresholds.

At that point Winter is not merely at bot parity. It is the preferred place for managing InterChat, while the bot remains the best place for contextual Discord actions.
