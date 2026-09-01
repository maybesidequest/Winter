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
| P3-BASE | Phase 3 entry gate | Pending completion of Phase 2 proof | — | release owner | — | blocked |

## Release blockers

The release remains blocked while any required Phase 1/2/3 gate lacks evidence,
Winter has a forbidden credential or shared-table access, a fallback writer
exists, a critical/high security finding is open, or staging/public rollout
has not been separately authorized.
