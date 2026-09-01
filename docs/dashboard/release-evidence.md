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

## Evidence entry format

Each entry records the capability, repository SHA(s), command or environment,
date, operator/reviewer, result, and links to logs, traces, screenshots, or
test names. Local evidence is explicitly separated from staging evidence.

| ID | Phase/capability | Evidence | Environment | Owner | Date | Status |
| --- | --- | --- | --- | --- | --- | --- |
| P3-BASE | Phase 3 entry gate | Phase 2 exit evidence still requires the missing clean-checkout, browser, and staging records listed below | local worktrees | release owner | 2026-09-01 | blocked |
| P3-TRANSPORT | Static Control Plane transport | Winter `133ab5e`, `0fed93f`, `a6da411`; `node scripts/generate-control-types.mjs`; generated drift check; `node scripts/validate-phase3.mjs` | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-WINTER-TEST | Winter regression suite | `BUN_TMPDIR=/tmp npx --yes bun@1.3.9 test` — 37 passed, 0 failed, 110 expectations; security subset after CSRF/shortcut changes — 10 passed, 0 failed, 29 expectations | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-WINTER-TYPE | Winter type and build gates | Winter `d372381`, `d1ddedb`, `fb649dd`; `node_modules/.bin/react-router typegen && node_modules/.bin/tsc --noEmit --pretty false`; `node_modules/.bin/react-router build` | Winter local worktree | implementation owner | 2026-09-01 | passed locally; build retains externalized-node and large-chunk warnings |
| P3-CONTROL | Durable operations, selectors, previews, and canonical Bot authorization | InterChat `2720242c`, `8cc84ba8`, `960e4076`, `9cf99ba9`, `cffc514d`, `9f7950e`, `239a558d`, `ccf8f953`, `f77516ce`, `dee5b6e6`, `fab45595`, `38717236`, `2c884935`; selector suite — 7 passed; operation service suite — 5 passed; targeted Bot Ruff/Pyright passed; Bot Hub permission checks, outbox management reads, connection command mutations, hub info/rules/disconnect lookups, and deleted-channel cleanup now route through Control Plane; bridge views now display desired connection state separately from observed health | InterChat local worktree | implementation owner | 2026-09-01 | passed locally; repository-wide Bot Pyright crashes pre-existing; Bot locale submodule unavailable for affected pytest collection |
| P3-SELECTORS | Hub/Server named entity discovery | InterChat `2720242c`, `8cc84ba8`, `960e4076`; focused selector suite covers Hub users, Server members, Server roles, manageable Server targets, parent scoping, pagination, and re-resolution | InterChat local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-OPERATIONS | Durable partial outcomes and service-only progress | InterChat `9cf99ba9`, `cffc514d`, `9e3166bb`, `f77516ce`, `ccf8f953`; operation progress accepts terminal `PARTIAL`, emits a durable transition, rejects human actors, returns typed `NOT_FOUND`, and connection connect/disconnect cleanup is correlated to durable operations with started/completed/failed outbox events; Control Plane operation suites — 11 passed; connect/disconnect correlation tests — 2 passed; Bot typed client correlation test — 1 passed | InterChat local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-LIFECYCLE | Canonical impact review | Winter `c7d16dd`; typed preview BFF and Hub transfer/deletion review dialog revalidate resource version and exact confirmation | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-BFF-OPS | Durable operation visibility | Winter `d372381`; typed ORPC get/list/cancel/retry routes expose Control Plane operation state without local persistence or fallback | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-UX-SHORTCUTS | Keyboard navigation foundation | Winter `d1ddedb`, `fb649dd`; guarded `/`, `g h`, `g s`, and `?` shortcuts with accessible help dialog; raw Discord ID removed from the user bar | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-UX-STATES | Truthful bridge state and health | Winter `b12d0eb`, `4b30fb1`, `5946573`; server bridge resources preserve Control Plane observed health and operation metadata, UI separates enabled/paused desired state from health attention, bridge search no longer enumerates raw channel IDs, unavailable names/timestamps remain explicit instead of fabricated, and disconnect uses an accessible typed confirmation; generated typecheck and structural validation passed | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-BOT-MODERATION-UI | Bot moderation presentation boundary | InterChat `adeeac49`; Hub sanction, appeal, and infraction views use canonical Control Plane responses and no longer render raw subject/infraction identifiers; targeted Ruff/Pyright passed | InterChat local worktree | implementation owner | 2026-09-01 | passed locally; full Bot UI pytest collection remains blocked by empty locales submodule |
| P3-PROTO | Additive protobuf contracts | protobuf `558bf43`; `protoc --include_imports` and `git diff --check` passed | protobuf local worktree | implementation owner | 2026-09-01 | partial — Buf unavailable |
| P3-GITOPS | Winter deployment boundary | GitOps `cfae914`; staging/prod Kustomize renders passed; Winter Iris/Polarizer paths removed and key-ring refs present | GitOps local worktree | operations owner | 2026-09-01 | partial — kubeconform/Conftest unavailable; no apply |

## Release blockers

The release remains blocked while any required Phase 1/2/3 gate lacks evidence,
Winter has a forbidden credential or shared-table access, a fallback writer
exists, a critical/high security finding is open, or staging/public rollout
has not been separately authorized.

Known local verification blockers are recorded rather than translated into
success: the native Bun executable, Buf, kubeconform, and Conftest are not
installed in this environment. Browser/Playwright, Lighthouse, k6, full
cross-repository CI, independent security review, staging authorization, and
cohort rollout evidence are not yet complete. No migration has been applied,
manifest has been applied, image has been published, or release has been
deployed.
