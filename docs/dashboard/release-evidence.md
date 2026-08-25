# Phase 1 Evidence Index

Status: **in progress — Phase 1 is not complete**

This file records evidence only. Code presence, a passing unit test, or a previous completion claim is not enough to check an exit-gate item.

## Exit-gate checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Bot and Winter use the same Hub General Control Plane operation | InterChat commits `27d1dd8c`, `4c53ced8`; Winter commits `2ce6649`, `c4233c4`; staging rollout flag | Code complete; staging trace pending |
| Winter cannot bypass authorization or write the Hub directly | Winter commit `648d385`; staging render exposes only `WINTER_DATABASE_URL` and Control Plane mTLS variables | Code/render pass; denied-write test pending |
| Idempotency, optimistic concurrency, and audit are correct | Control Plane test suite (`uv run ic test control`) | Automated pass; staging replay pending |
| Committed outbox work survives restart | Control Plane outbox tests | Automated pass; staging restart pending |
| Production UI contains no mock data or unfinished controls | Winter commit `2ce6649`; Docker build and image smoke passed | Code/build pass; browser smoke pending |
| Billing is absent | Billing component, route, and sidebar removed in `2ce6649` | Code pass; browser scan pending |
| CI and browser smoke pass | Lint/tests pass; bot Pyright has two pre-existing moderation errors | CI/browser gate pending |
| mTLS, probes, resources, NetworkPolicy, OTEL, and alerts are verified | GitOps commits `c8cc17d`, `3cd6f58`, `d7c04af`; staging Kustomize renders pass | Render pass; rollout/alerts pending |

## Required automated evidence

- `uv run ic lint`
- `uv run ic typecheck control` (pass); `bot` is blocked by two pre-existing moderation errors in `blocklist_dashboard.py`
- `uv run ic test control bot`
- `buf lint`
- `buf breaking --against '.git#branch=main'`
- `npm run generate:control-types` (pass; no generated diff)
- `./node_modules/.bin/tsc --noEmit` (pass)
- `docker build interchat-winter-phase1-smoke` (pass)
- `kubectl kustomize kubernetes/apps/control-plane/overlays/staging`
- `kubectl kustomize kubernetes/apps/winter/overlays/staging`
- `kubectl kustomize kubernetes/apps/otel-collector/overlays/staging`

## Staging evidence

Staging-only evidence is still required. Record the date, image digests, environment, operator, and result for:

1. Sign in with Discord.
2. Select a Hub.
3. Edit one General field.
4. Confirm the saved value after refresh.
5. Replay the same request and confirm one audit/outbox event.
6. Edit from two sessions and confirm a stale-version conflict.
7. Restart one Control Plane replica and confirm pending outbox work is published.

## Observability evidence

Link the OTEL Collector deployment, SigNoz dashboards, and alerts for RPC errors, latency, Iris/Discord failures, outbox lag, and unavailable replicas. Do not link Prometheus Operator resources; Prometheus Operator is not part of the architecture.
