# Phase 2: Reach bot management parity

Phase 2 makes Winter cover every non-contextual management job available to a normal user, Hub staff member, or Server manager. It should feel like a purpose-built control panel, not a collection of slash-command forms.

Previous: [Phase 1 — Make the dashboard trustworthy](./phase-1-foundation.md)  
Next: [Phase 3 — Make it better and release it](./phase-3-release.md)

## Start here

Take one row from the capability checklist and finish it across the whole system:

1. Define or extend the protobuf resource and operation.
2. Implement the control-service handler with authorization, audit, idempotency, and side effects.
3. Make the bot command a presentation adapter for that handler.
4. Build the Winter workflow through its ORPC BFF.
5. Test both surfaces against the same capability contract.
6. Cut over behind one capability flag, then delete the old write path after a short soak.

A row is not done because a page exists. It is done when both surfaces use the same backend behavior and every acceptance check passes.

## Product boundary

Included:

- Normal-user account, discovery, information, and preference features.
- Hub owner, manager, moderator, and other Hub Team features.
- Server manager settings, Hub connections, Calls configuration, and blocklists.
- Connecting a Discord Server channel to a Hub from Winter.
- Read-only history or summaries that help users manage these resources.

Keep in Discord for now:

- Starting, joining, skipping, or ending Calls and Group Calls.
- Sending a friend request during a Call.
- Reporting a message.
- Viewing message info.
- Other actions that only make sense beside the current Discord message or conversation.
- Global InterChat staff commands and the `/staff` control surface.

Also excluded: Billing, subscriptions, developer commands, beta administration, MUD, and global trust-and-safety operations.

## UX standard for every capability

Winter must improve the job, not reproduce command arguments.

- Use plain names and one job per screen. Avoid labels joined with `&`.
- Use searchable Discord-aware Server, channel, user, and Hub selectors. Do not ask for snowflakes when Winter can look them up.
- Never ask a user to create or paste a webhook URL. The control service creates and repairs webhooks.
- Explain what a setting changes before the user saves it.
- Validate while the user is editing and place the error next to the problem.
- Preview messages, branding, rules, badges, logging destinations, and announcements when useful.
- Explain why a control is unavailable and which permission is required.
- Show inherited and effective values without storing them as configuration.
- Warn before destructive or broad changes and name the affected Hub, Server, or channels.
- Use `Saving`, `Waiting for Discord`, or `Needs attention`; never expose queue or infrastructure jargon.
- Preserve unsaved work when a recoverable dependency fails.
- Meet keyboard, screen-reader, focus, contrast, responsive, loading, empty, and error-state requirements.

## Capability checklist

The command names below are evidence of existing bot behavior. Winter may group related capabilities into a better workflow.

### Normal users

| Capability | Existing bot surface | Winter outcome | Done when |
| --- | --- | --- | --- |
| Help and product information | `/help`, `/about`, `/rules`, `/invite`, `/dashboard`, `/vote` | Searchable help, rules, bot invite, support, and voting links | Content is current, readable without Discord, and deep-linkable |
| Public health and activity | `/stats`, `/leaderboard` | Real global statistics and leaderboard views | No mock counters; source, update time, empty state, and pagination are clear |
| Find a Hub | `/hub directory`, `/hub discover` | Search, sort, filter, inspect, and begin a connection workflow | Private/unlisted Hubs never leak; results use URL state |
| Understand a Hub | `/hub info`, `/hub rules`, `/hub leaderboard` | Hub profile, rules, status, and leaderboard pages | Public and permissioned data are separated and cached safely |
| Create a Hub | `/hub create` | Guided creation wizard with preview and permission checks | User can create without knowing bot terminology and sees the created Hub |
| Profile and passport | `/profile`, `/passport` | Personal profile and passport with safe public viewing | Privacy settings and badge visibility are honored |
| Requests and announcements | `/passport inbox`, `/my inbox` | Inbox for tag shares, connection requests, and official announcements | Unread state, accept/decline actions, and pagination work |
| Personal activity | `/my activity` | Real activity, streak, and contribution history | Values are sourced, time-bounded, and not confused with settings |
| Personal Hub list | `/my hubs` | Searchable owned and staffed Hub list | Effective role and allowed next actions are correct |
| Preferences | `/my settings` | Language, reply mention, badges, streak reminders, and vote reminders | Save, reset, validation, and effective values work |
| Feedback | `/feedback` | Simple feedback flow | Submission has spam protection, receipt state, and no false success |
| Appeals | `/appeal` | View eligible Hub infractions and submit an appeal | Cooldown, eligibility, privacy, status, and audit trail match the bot |

Contextual `/report`, Call controls, message info, and in-Call friend requests intentionally remain in Discord.

### Server managers

| Capability | Existing bot surface | Winter outcome | Done when |
| --- | --- | --- | --- |
| Guided setup | `/setup` | Server setup wizard for bot readiness, Calls configuration, creating a Hub, or connecting to one | Checks real bot/channel permissions and offers recovery steps |
| Server overview | `/server manage` | Status, installation health, effective settings, and recent management activity | Status is observed, timestamped, and never hard-coded |
| Calls settings | `/server manage` Userphone settings | Configure Call channel, display name, ping, requeue, and NSFW filtering | This configures Calls; it does not start one |
| Prefix | `/prefix` | View, change, and reset the Server prefix | Length and permission rules match the bot |
| Blocklist | `/server viewblocks`, `block`, `unblock` | Search, add, inspect, and remove blocked users or Servers | Target type, reason, author, time, duplicates, and audit are correct |
| Hub connections | `/server bridges`, `/hub connect`, `/hub disconnect` | View all channel bridges and connect/disconnect a selected channel | Uses searchable selectors and the full connection workflow below |
| Connection maintenance | `/connection swaphooks` and bot repair behavior | Show observed health and repair or swap delivery webhooks when permitted | Secrets remain hidden; results and recovery state are clear |

#### Required channel-to-Hub connection workflow

Winter asks the user to choose a Server, channel, Hub, and optional invite. The control service must then:

1. Verify the user can manage the Server and channel.
2. Verify the bot is installed and can view the channel, send messages, and manage webhooks.
3. Reject unsupported channel types and channels in an active Call.
4. Check Hub visibility, invite validity, lock state, and uniqueness rules.
5. Create or repair both webhooks without exposing their credentials.
6. Create or reactivate the Connection and consume the invite atomically.
7. Update derived counts, audit the action, and publish routing invalidation through the outbox.
8. Compensate for orphaned webhooks if persistence fails.
9. Return a Connection resource with desired state and observed health.

Disconnect disables routing first, then removes webhooks asynchronously. A Discord outage must not leave a route active by accident.

### Hub owners and staff

| Area | Existing bot surface | Winter outcome | Permission and completion notes |
| --- | --- | --- | --- |
| Overview | `/hub info`, `/hub leaderboard`, `/hub server-activity` | Hub health, connected Servers, activity, and useful trends | Read access only; real timestamps and sources |
| General | `/hub manage` → General | Name, tagline, description, welcome message, icon, banner, visibility, NSFW flag, streaks, appeal cooldown, and rules entry point | Check permission for each changed field |
| Modules | `/hub manage` → Modules | Enable and configure message/attachment modules | Preview effective behavior and incompatible choices |
| Rules | `/hub rules`; `/hub manage` → rules | Add, reorder, edit, and remove rules | Requires `MANAGE_RULES`; destructive changes are confirmed |
| Logging | `/hub manage` → Logging | Configure destinations and notification roles by event type | Validate Server/channel access; do not claim a stream is active without observed status |
| Badges | `/hub manage` → Badges | Configure Owner, Manager, and Moderator badges | Preview relayed-message appearance |
| Invites | `/hub invite`; `/hub manage` → Invites | Create, list, copy, expire, and revoke Hub invites | Never reveal private-Hub data without access; audit use and revocation |
| Team | `/hub staff`; `/hub manage` → Team | Search people, assign roles, remove access, and explain effective permissions | Requires `MANAGE_MODERATORS`; invalidate Iris authorization after change |
| Announcements | `/mod announce`; `/hub manage` → Announcements | Draft, preview, schedule, edit, pause, and remove announcements | Requires `ANNOUNCE`; show delivery schedule and observed status |
| Connections | `/hub servers`, `/server bridges` | Search, filter, pause, resume, repair, and disconnect Hub connections | Requires `MANAGE_CONNECTIONS`; each relationship is a resource |
| Safety settings | `/hub manage` → AutoMod and safety settings | Configure content policy, allowlists, media filtering, and moderation behavior | Do not mix global staff policy with Hub policy |
| Moderation actions | `/mod ban`, `mute`, `warn`, `unban`, `unmute` | Search a user or Server, explain impact, apply or revoke a sanction | Requires the exact moderation action; duration/reason validation matches bot |
| Moderation records | `/mod panel`, `/mod logs`, `/mod delinfraction` | Filter sanctions, inspect history, and revoke eligible infractions | Requires log access; private evidence is protected |
| Hub state | `/mod hub lock`, `/mod hub unlock` | Lock or unlock with an impact summary and confirmation | Requires `LOCKDOWN_HUB`, not broad settings permission |
| Audit history | `/hub audit` | Search configuration history by actor, action, resource, and date | Requires `VIEW_LOGS`; before/after diff is accurate |
| Ownership and deletion | `/hub manage` → Transfer; `/hub delete` | Transfer ownership or permanently delete with strong confirmation | Owner only; preserve required audit history |
| Message removal from records | `Delete Message` context action | When an authorized log already identifies a relayed message, allow deletion from that record | Do not build general message browsing or message-info features |
| Safety assessments | `/safety check`, `/safety guild-check` | Show assessment only where the actor has an existing Hub safety permission | Explain signals carefully; do not expose global staff-only data |

## Recommended implementation order

Work from low-risk configuration toward Discord side effects and destructive operations:

1. Normal-user reads, profile, preferences, inbox, and Hub discovery.
2. Hub general details, rules, and modules.
3. Server overview, prefix, Calls configuration, and blocklist.
4. Logging, badges, invites, announcements, and audit history.
5. Hub Team and Iris permission invalidation.
6. Sanctions, records, safety assessments, and lockdown.
7. Connection pause/resume/disconnect and maintenance.
8. Full channel-to-Hub connection workflow.
9. Ownership transfer, deletion, and other destructive operations.

This order is guidance, not a ban on parallel work. A developer may reorder independent slices when the contracts and dependencies are ready. Do not ship a slice that bypasses the shared service to make the page appear complete.

## Required implementation ticket

Before coding a capability row, create a small ticket using this template. Keep answers concrete; link code instead of repeating the phase documents.

```text
Capability:
User outcome:
Included bot commands/screens:
Explicitly excluded contextual actions:
Resource and relationship types:
RPC methods and protobuf fields:
Required Iris and Discord permissions by field/action:
Validation and conflict rules:
Database tables read/written:
Audit event and before/after fields:
Outbox events and consumers:
Synchronous result or durable operation states:
External side effects and compensation:
Winter route, selectors, preview, and UI states:
Bot adapter entry points:
Feature flag and atomic cutover steps:
Old code removed after soak:
Tests and observable success measures:
```

A ticket is ready to implement when another developer can identify the authoritative handler, every permission, all persistent effects, failure behavior, and both client entry points without reading the old UI code to guess the intended behavior.

## Definition of done for one capability

- [ ] A named product owner or maintainer has confirmed the expected outcome and contextual exclusions.
- [ ] The protobuf contract is resource-oriented and passes compatibility checks.
- [ ] The control service independently authorizes the actor and validates the full operation.
- [ ] The mutation is idempotent, version-aware, audited, and uses the outbox for post-commit effects.
- [ ] The bot and Winter use the same control-service operation.
- [ ] Winter uses plain language, helpful selectors, inline validation, and complete UI states.
- [ ] Permission-denied, stale edit, unavailable dependency, partial external failure, retry, and success paths are tested.
- [ ] Metrics and traces identify the capability, result, latency, request ID, and source without leaking secrets.
- [ ] The old direct write path is removed after cutover; no dual-write remains.
- [ ] The capability matrix and user help are updated.

## Phase 2 exit gate

- [ ] Every included row above meets the per-capability definition of done.
- [ ] A generated contract inventory and a maintained capability matrix make omissions visible in CI or review.
- [ ] Bot and Winter parity tests cover permissions, validation, audit output, returned resource, and emitted effects.
- [ ] Winter no longer has management-table write access or a Discord bot token.
- [ ] Normal users can complete common tasks without IDs, webhook knowledge, or Discord command knowledge.
- [ ] Hub staff see only the controls their effective permissions allow.
- [ ] Server managers can safely connect a channel to a Hub from Winter.
- [ ] The agreed contextual actions still hand off to Discord instead of offering half-working web versions.
- [ ] All visible tabs are functional. Work-in-progress tabs remain behind development or explicit feature flags.

Passing Phase 2 gives Winter management parity. It is still internal until the quality and release gates in Phase 3 pass.
