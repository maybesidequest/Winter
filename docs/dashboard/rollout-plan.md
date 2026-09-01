# Phase 3 rollout plan

Feature flags are server-side visibility controls only. They never authorize,
dual-write, or select a legacy fallback. Each flag has an owner, purpose,
percentage, allowlisted users/Hubs, expiry, safe default, and emergency disable.

## Cohorts and observation windows

1. Maintainers — 24 hours.
2. Internal users — 48 hours.
3. Five percent of eligible Hubs — 72 hours.
4. Twenty-five percent — 72 hours.
5. Fifty percent — 72 hours.
6. Signed public-release go decision.
7. One hundred percent — seven-day watch.

Expansion stops immediately for security, data-integrity, privilege, or secret
issues; other threshold failures sustained for 15 minutes stop expansion.

## Go thresholds

LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, unexpected errors < 1%, Control Plane
read p95 ≤ 500 ms, ordinary mutation p95 ≤ 1 s, outbox p95 lag ≤ 15 s,
maximum lag < 5 minutes, no operation stuck > 5 minutes, journey success ≥
80%, zero P0/P1 issues, and support volume ≤ 5% of the cohort.

## Rollback

Disable the affected flag, optionally disable all Winter management surfaces,
roll back to the last compatible image digest, leave additive migrations in
place, preserve audit/outbox/operation history, and continue management through
the canonical Bot path. Never restore a direct writer.
