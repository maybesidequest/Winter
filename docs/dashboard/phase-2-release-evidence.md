# Phase 2 release evidence

This record is the release gate for the capability matrix. A capability is not
`complete` because a route or handler exists. It is complete only when every
column below links to current evidence from the same commit range.

## Required evidence

Each capability must have all of the following before its flag is enabled for
general users:

1. **Contract** — canonical `.proto` change and reproducible generated Python
   and TypeScript output.
2. **Authorization** — direct Control Plane tests for owner/manager access,
   unrelated users, wrong parents, revoked staff, malformed IDs, and dependency
   failures.
3. **Parity** — Bot and Winter use the same RPC and return the same canonical
   resource, version, and typed failure.
4. **Winter smoke** — loading, empty, read-only, forbidden, unavailable,
   conflict, validation, and success states are covered.
5. **Staging trace** — a deployed staging run proves the RPC, Iris/Discord
   dependencies, audit event, and outbox side effect. Include trace/dashboard
   links; local tests are not sufficient.
6. **Cutover** — the flag, deployment configuration, and old-writer removal
   commit are linked. No dual-write or fallback path may remain.

Use `missing` while any item is absent. `control-only`, `dual-path`,
`soaking`, and `complete` are descriptive states, not approvals. `complete`
requires an owner and a verification date.

## Capability records

| Matrix ID | Contract | AuthZ | Bot parity | Winter smoke | Staging trace | Cutover / old writer | Status | Owner / verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HUB-001–HUB-030 | pending | pending | pending | pending | pending | pending | missing | — |

Expand the range into one row per matrix ID before marking any row complete.
Evidence links must point to a commit, test name, deployment revision, or
dashboard trace—not to a planning document or an unverified claim.

## Global gates

No Phase 2 flag may be enabled unless these repository-wide gates are green:

- Winter has no shared management `DATABASE_URL`, Drizzle management schema,
  or Discord bot token.
- Control Plane identity is bound to the mTLS workload and method allowlist;
  request actor fields do not grant authority.
- Mutations enforce idempotency, expected-version conflicts, audit, and a
  transactionally published outbox with restart-safe consumer deduplication.
- Generated clients are consumed directly; dynamic `any`/reflection wrappers
  are not accepted for a released capability.
- CI validates that every visible Winter route, Control RPC, and included Bot
  command maps to exactly one matrix row. Unfinished rows remain hidden.
