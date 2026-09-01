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
| P3-WINTER-TEST | Winter regression suite | `BUN_TMPDIR=/tmp npx --yes bun@1.3.9 test` — 33 passed, 0 failed, 95 expectations | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-WINTER-TYPE | Winter type and build gates | `react-router typegen && tsc --noEmit`; `react-router build` | Winter local worktree | implementation owner | 2026-09-01 | passed locally |
| P3-CONTROL | Durable operations, selectors, previews | InterChat `669ebdac`; `uv run --project apps/control_plane pytest apps/control_plane/tests -q` — 219 passed; Ruff and Control Plane Pyright passed | InterChat local worktree | implementation owner | 2026-09-01 | passed locally |
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
