# Phase 1 Evidence Index

Status: **in progress — Phase 1 is not complete**

This file records evidence only. Code presence, a passing unit test, or a previous completion claim is not enough to check an exit-gate item.

## Exit-gate checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Bot and Winter use the same Hub General Control Plane operation | Control RPC contract, Bot test, Winter test, staging trace | Pending |
| Winter cannot bypass authorization or write the Hub directly | Static access scan, deployment manifest, denied-write test | Pending |
| Idempotency, optimistic concurrency, and audit are correct | Replay, conflict, rollback, and audit tests | Pending |
| Committed outbox work survives restart | Publisher restart test and staging replay evidence | Pending |
| Production UI contains no mock data or unfinished controls | Browser smoke and route/navigation scan | Pending |
| Billing is absent | Production route and navigation scan | Pending |
| CI and browser smoke pass | Linked CI run and dated staging smoke record | Pending |
| mTLS, probes, resources, NetworkPolicy, OTEL, and alerts are verified | Rendered manifests, rollout result, dashboard/alert links | Pending |

## Required automated evidence

- `uv run ic lint`
- `uv run ic typecheck control bot`
- `uv run ic test control bot`
- `buf lint`
- `buf breaking --against '.git#branch=main'`
- `bun run generate:control-types`
- `bun run typecheck`
- `bun run build`
- `kubectl kustomize kubernetes/apps/control-plane/overlays/staging`
- `kubectl kustomize kubernetes/apps/winter/overlays/staging`

## Staging evidence

Record the date, image digests, environment, operator, and result for:

1. Sign in with Discord.
2. Select a Hub.
3. Edit one General field.
4. Confirm the saved value after refresh.
5. Replay the same request and confirm one audit/outbox event.
6. Edit from two sessions and confirm a stale-version conflict.
7. Restart one Control Plane replica and confirm pending outbox work is published.

## Observability evidence

Link the OTEL Collector deployment, SigNoz dashboards, and alerts for RPC errors, latency, Iris/Discord failures, outbox lag, and unavailable replicas. Do not link Prometheus Operator resources; Prometheus Operator is not part of the architecture.
